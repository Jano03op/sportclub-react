import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import { getMyReservations, cancelReservation } from '../../services/memberService';
import { showApiError } from '../../utils/alerts';
import { dayName, formatTime } from '../../utils/schedule';
import { formatDate } from '../../utils/format';

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const loadReservations = () => {
    getMyReservations()
      .then((data) => setReservations(data))
      .catch((error) => showApiError(error, 'No se pudieron cargar tus reservas'))
      .finally(() => setLoading(false));
  };

  const handleRefresh = () => {
    setLoading(true);
    loadReservations();
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (reservation) => {
    const classTitle = reservation.classSchedule?.sportRoom?.sport?.name || 'Clase';
    const day = dayName(reservation.classSchedule?.day_of_week);
    const time = `${formatTime(reservation.classSchedule?.start_time)} – ${formatTime(reservation.classSchedule?.end_time)}`;

    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: `¿Estás seguro de que quieres cancelar tu reserva para "${classTitle}" los ${day} de ${time}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await cancelReservation(reservation.id);
        Swal.fire({
          title: 'Cancelada',
          text: 'Tu reserva ha sido cancelada correctamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
        loadReservations(); // Recargar listado
      } catch (error) {
        showApiError(error, 'No se pudo cancelar la reserva');
      }
    }
  };

  const filteredReservations = reservations.filter((res) => {
    if (!statusFilter) return true;
    return res.status === statusFilter;
  });

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-2">
          <Col xs={12} md>
            <h4 className="mb-0 d-flex align-items-center gap-2">
              Mis Reservas de Clases
              <Badge bg="secondary" pill>
                {filteredReservations.length}
              </Badge>
            </h4>
          </Col>
          <Col xs={12} md="auto">
            <div className="d-flex gap-2">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ maxWidth: 180 }}
                aria-label="Filtrar por estado"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="cancelled">Canceladas</option>
              </Form.Select>
              <Button variant="outline-secondary" onClick={handleRefresh}>
                Refrescar
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2 text-muted">Cargando tus reservas...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID Reserva</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Entrenador</th>
                <th>Día</th>
                <th className="text-center">Horario</th>
                <th>Fecha Reserva</th>
                <th>Observación</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center text-muted py-4">
                    {reservations.length === 0
                      ? 'No has realizado ninguna reserva todavía.'
                      : 'Sin resultados para el filtro seleccionado.'}
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const schedule = res.classSchedule;
                  const sportRoom = schedule?.sportRoom;
                  return (
                    <tr key={res.id}>
                      <td>{res.id}</td>
                      <td className="fw-semibold text-primary">
                        {sportRoom?.sport?.name || '—'}
                      </td>
                      <td className="fw-semibold">{sportRoom?.room?.name || '—'}</td>
                      <td>{sportRoom?.coach?.full_name || sportRoom?.coach?.email || 'Sin asignar'}</td>
                      <td>{dayName(schedule?.day_of_week)}</td>
                      <td className="text-center text-nowrap">
                        <Badge bg="info" text="dark">
                          {formatTime(schedule?.start_time)} – {formatTime(schedule?.end_time)}
                        </Badge>
                      </td>
                      <td>{formatDate(res.created_at)}</td>
                      <td style={{ maxWidth: 200 }} className="text-truncate" title={res.observation || ''}>
                        {res.observation || <span className="text-muted small">Ninguna</span>}
                      </td>
                      <td className="text-center">
                        <Badge bg={res.status === 'active' ? 'success' : 'secondary'}>
                          {res.status === 'active' ? 'Activa' : 'Cancelada'}
                        </Badge>
                      </td>
                      <td className="text-center">
                        {res.status === 'active' ? (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancel(res)}
                          >
                            Cancelar
                          </Button>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
