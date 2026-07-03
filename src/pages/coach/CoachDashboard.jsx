import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getCoachDashboard } from '../../services/coachService';
import { showApiError } from '../../utils/alerts';
import { dayName, formatTime } from '../../utils/schedule';

export default function CoachDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCoachDashboard()
      .then((dashboardData) => setData(dashboardData))
      .catch((error) => showApiError(error, 'No se pudo cargar la información del panel'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mb-4">
        <h2>Panel de Entrenador</h2>
        <p className="text-muted">Bienvenido, {user?.full_name}</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2 text-muted">Cargando información del panel...</p>
        </div>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4 mb-4">
            <Col>
              <Card className="h-100 shadow-sm">
                <Card.Header as="h5" className="bg-light">Mi Perfil</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Nombre:</strong> {user?.full_name}</ListGroup.Item>
                  <ListGroup.Item><strong>Email:</strong> {user?.email}</ListGroup.Item>
                  <ListGroup.Item><strong>Rol:</strong> Entrenador</ListGroup.Item>
                  {user?.birth_date && (
                    <ListGroup.Item><strong>Fecha Nacimiento:</strong> {user.birth_date}</ListGroup.Item>
                  )}
                </ListGroup>
                <Card.Body className="d-flex align-items-end">
                  <Button as={Link} to="/coach/profile" variant="outline-primary" size="sm" className="w-100">
                    Ver perfil completo
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="h-100 shadow-sm text-center">
                <Card.Header as="h5" className="bg-light">Mis Clases</Card.Header>
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <h1 className="display-4 fw-bold text-primary mb-3">
                    {data?.total_classes || 0}
                  </h1>
                  <Card.Text className="text-muted mb-4">
                    Clases/Asignaciones activas a tu cargo.
                  </Card.Text>
                  <Button as={Link} to="/coach/classes" variant="primary" size="sm" className="w-100 mt-auto">
                    Ver mis clases
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="h-100 shadow-sm text-center">
                <Card.Header as="h5" className="bg-light">Horarios y Salas</Card.Header>
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <Row className="w-100 mb-3">
                    <Col>
                      <h2 className="fw-bold text-info mb-0">{data?.total_schedules || 0}</h2>
                      <small className="text-muted">Horarios</small>
                    </Col>
                    <Col>
                      <h2 className="fw-bold text-success mb-0">{data?.total_rooms || 0}</h2>
                      <small className="text-muted">Salas</small>
                    </Col>
                  </Row>
                  <Card.Text className="text-muted mb-4">
                    Bloques horarios asignados en distintas salas.
                  </Card.Text>
                  <Button as={Link} to="/coach/schedule" variant="info" text="white" size="sm" className="w-100 mt-auto text-white">
                    Ver mi horario
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm border-start border-4 border-primary">
            <Card.Header as="h5" className="bg-light">Siguiente Clase Programada</Card.Header>
            <Card.Body>
              {data?.next_class ? (
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <h4 className="text-primary mb-1">
                      {data.next_class.sportRoom?.sport?.name || 'Deporte'}
                    </h4>
                    <p className="mb-2 text-muted">
                      <strong>Sala:</strong> {data.next_class.sportRoom?.room?.name || 'Sin especificar'} 
                      {data.next_class.sportRoom?.room?.location && ` — ${data.next_class.sportRoom.room.location}`}
                    </p>
                    <div className="d-flex gap-3 mt-3">
                      <div>
                        <strong>Día:</strong> {dayName(data.next_class.day_of_week)}
                      </div>
                      <div>
                        <strong>Hora:</strong> {formatTime(data.next_class.start_time)} – {formatTime(data.next_class.end_time)}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
                    <Button as={Link} to="/coach/schedule" variant="outline-primary">
                      Ver en mi agenda
                    </Button>
                  </Col>
                </Row>
              ) : (
                <p className="text-muted mb-0 py-2">
                  No tienes clases programadas próximamente en tu horario activo.
                </p>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
}
