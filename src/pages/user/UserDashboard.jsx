import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useAuth } from '../../context/useAuth';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <>
      <div className="mb-4">
        <h2>Panel de Usuario</h2>
        <p className="text-muted">Bienvenido, {user?.full_name}</p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5">Mi perfil</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Nombre:</strong> {user?.full_name}</ListGroup.Item>
              <ListGroup.Item><strong>Email:</strong> {user?.email}</ListGroup.Item>
              <ListGroup.Item><strong>Rol:</strong> Usuario</ListGroup.Item>
              {user?.birth_date && (
                <ListGroup.Item><strong>Fecha de nacimiento:</strong> {user.birth_date}</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5">Mis clases</Card.Header>
            <Card.Body>
              <Card.Text className="text-muted">
                Próximamente podrás ver tus clases reservadas aquí.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5">Mis reservas</Card.Header>
            <Card.Body>
              <Card.Text className="text-muted">
                Próximamente podrás gestionar tus reservas aquí.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
