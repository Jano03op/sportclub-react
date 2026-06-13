import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useAuth } from '../../context/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-4">
        <h2>Bienvenido, {user?.full_name}</h2>
        <p className="text-muted">Panel de Administración — SportClub</p>
      </div>

      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5">Gestión de Usuarios</Card.Header>
            <Card.Body>
              <Card.Text className="text-muted">
                Crea, edita y elimina usuarios del sistema.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate('/admin/users')}>
                Ir a Usuarios
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5">Mi Perfil</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Nombre:</strong> {user?.full_name}</ListGroup.Item>
              <ListGroup.Item><strong>Correo:</strong> {user?.email}</ListGroup.Item>
              <ListGroup.Item><strong>Rol:</strong> Administrador</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
