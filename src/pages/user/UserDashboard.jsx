import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { getMemberDashboard } from '../../services/memberService';
import { showApiError } from '../../utils/alerts';

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMemberDashboard()
      .then((dashboardData) => setData(dashboardData))
      .catch((error) => showApiError(error, 'No se pudo cargar la información del panel'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mb-4">
        <h2>Panel de Usuario</h2>
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
                  <ListGroup.Item><strong>Rol:</strong> Usuario</ListGroup.Item>
                  {user?.birth_date && (
                    <ListGroup.Item><strong>Fecha Nacimiento:</strong> {user.birth_date}</ListGroup.Item>
                  )}
                </ListGroup>
                <Card.Body className="d-flex align-items-end">
                  <Button as={Link} to="/user/profile" variant="outline-primary" size="sm" className="w-100">
                    Ver perfil completo
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="h-100 shadow-sm text-center">
                <Card.Header as="h5" className="bg-light">Clases Disponibles</Card.Header>
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <h1 className="display-4 fw-bold text-primary mb-3">
                    {data?.available_classes || 0}
                  </h1>
                  <Card.Text className="text-muted mb-4">
                    Clases deportivas en curso. ¡Hay <strong>{data?.available_schedules || 0}</strong> horarios listos para reservar!
                  </Card.Text>
                  <Button as={Link} to="/user/classes" variant="primary" size="sm" className="w-100 mt-auto">
                    Explorar clases y reservar
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="h-100 shadow-sm text-center">
                <Card.Header as="h5" className="bg-light">Mis Reservas</Card.Header>
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <div className="my-3">
                    <i className="bi bi-calendar2-check-fill text-success" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Text className="text-muted mb-4">
                    Revisa tus reservas actuales, historial de asistencia y cancela si es necesario.
                  </Card.Text>
                  <Button as={Link} to="/user/reservations" variant="success" size="sm" className="w-100 mt-auto">
                    Ver mis reservas
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm">
            <Card.Header as="h5" className="bg-light">Clases Destacadas</Card.Header>
            <Card.Body>
              {data?.next_classes && data.next_classes.length > 0 ? (
                <Row xs={1} md={3} className="g-3">
                  {data.next_classes.map((cls) => (
                    <Col key={cls.id}>
                      <Card className="h-100 border-light bg-light shadow-sm">
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="text-primary fw-bold">{cls.sport?.name}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Sala: {cls.room?.name}
                          </Card.Subtitle>
                          <Card.Text className="small text-muted flex-grow-1">
                            {cls.sport?.objective || 'Sin descripción disponible.'}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                            <Badge bg="info" text="dark">
                              {cls.schedules?.length || 0} Horarios
                            </Badge>
                            <Button as={Link} to="/user/classes" variant="outline-primary" size="sm">
                              Ver horarios
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted mb-0 py-2">No hay clases disponibles en este momento.</p>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
}
