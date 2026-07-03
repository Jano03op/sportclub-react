import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Swal from 'sweetalert2';
import {
  getMemberClasses,
  getMemberRooms,
  getMemberSports,
  createReservation,
} from '../../services/memberService';
import { showApiError } from '../../utils/alerts';
import { dayName, formatTime } from '../../utils/schedule';
import ReservationModal from '../../components/reservations/ReservationModal';

export default function AvailableClassesPage() {
  const [classes, setClasses] = useState([]);
  const [sports, setSports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  // Reservation Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const loadData = () => {
    setLoading(true);
    const filters = {};
    if (selectedSport) filters.sport_id = selectedSport;
    if (selectedRoom) filters.room_id = selectedRoom;

    Promise.all([
      getMemberClasses(filters),
      getMemberSports(),
      getMemberRooms(),
    ])
      .then(([classesData, sportsData, roomsData]) => {
        setClasses(classesData);
        setSports(sportsData);
        setRooms(roomsData);
      })
      .catch((error) => showApiError(error, 'No se pudo cargar la información de clases'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedSport, selectedRoom]);

  const openReservationModal = (schedule, cls) => {
    // Adjuntamos datos adicionales para mostrar info completa en el modal
    setSelectedSchedule({
      ...schedule,
      sportRoom: {
        sport: cls.sport,
        room: cls.room,
        coach: cls.coach,
      },
    });
    setShowModal(true);
  };

  const closeReservationModal = () => {
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleConfirmReservation = async (reservationData) => {
    try {
      await createReservation(reservationData);
      Swal.fire({
        title: '¡Reservado!',
        text: 'Tu reserva se ha registrado de forma correcta.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
      closeReservationModal();
      loadData(); // Recargamos para reflejar el estado actual
    } catch (error) {
      showApiError(error, 'No se pudo completar tu reserva');
      throw error;
    }
  };

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <Row className="align-items-center g-3">
            <Col xs={12} md>
              <h4 className="mb-0">Buscar Clases Disponibles</h4>
              <p className="text-muted small mb-0">Filtra por disciplina o sala deportiva para agendar tus horas.</p>
            </Col>
            <Col xs={12} md="auto">
              <Row className="g-2">
                <Col xs={6} md="auto">
                  <Form.Select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    style={{ minWidth: 160 }}
                    aria-label="Filtrar por Deporte"
                  >
                    <option value="">Todos los Deportes</option>
                    {sports.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={6} md="auto">
                  <Form.Select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    style={{ minWidth: 160 }}
                    aria-label="Filtrar por Sala"
                  >
                    <option value="">Todas las Salas</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Header>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2 text-muted">Cargando clases disponibles...</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {classes.length === 0 ? (
            <Col xs={12} className="text-center py-5 text-muted">
              <h4>No se encontraron clases con los filtros seleccionados.</h4>
              <p>Intenta cambiar los filtros de búsqueda.</p>
            </Col>
          ) : (
            classes.map((cls) => (
              <Col key={cls.id}>
                <Card className="h-100 shadow-sm border-light">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="text-primary fw-bold mb-0">{cls.sport?.name}</h5>
                      <Badge bg="secondary" pill>
                        {cls.sport?.duration ? `${cls.sport.duration} min` : '—'}
                      </Badge>
                    </div>
                    <Card.Subtitle className="mb-3 text-muted small">
                      Sala: <span className="fw-semibold text-dark">{cls.room?.name}</span> 
                      {cls.room?.location && ` (${cls.room.location})`}
                    </Card.Subtitle>
                    <Card.Text className="small text-muted flex-grow-1 mb-3">
                      {cls.sport?.objective || 'Sin descripción de objetivos.'}
                    </Card.Text>

                    <div className="mb-3 p-2 bg-light rounded small">
                      <strong>Entrenador:</strong> {cls.coach?.full_name || 'Sin asignar'}
                    </div>

                    <h6 className="fw-bold text-dark border-bottom pb-1 small">Horarios Disponibles</h6>
                    {cls.schedules && cls.schedules.length > 0 ? (
                      <ListGroup variant="flush" className="small">
                        {cls.schedules.map((schedule) => (
                          <ListGroup.Item
                            key={schedule.id}
                            className="d-flex justify-content-between align-items-center px-0 bg-transparent py-2"
                          >
                            <div>
                              <span className="fw-semibold text-dark">{dayName(schedule.day_of_week)}</span>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {formatTime(schedule.start_time)} – {formatTime(schedule.end_time)}
                              </div>
                            </div>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => openReservationModal(schedule, cls)}
                            >
                              Reservar
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <span className="text-muted small">Sin horarios habilitados.</span>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      <ReservationModal
        show={showModal}
        handleClose={closeReservationModal}
        handleSave={handleConfirmReservation}
        schedule={selectedSchedule}
      />
    </>
  );
}
