import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../context/useAuth';
import logo from '../../assets/logo_empresa_letra_v1.png';

export default function DashboardNavbar({ links, roleLabel, profileTo }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <Navbar expand="lg" data-bs-theme="dark" className="sc-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} height="34" alt="SportClub" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="dashboard-nav" />
        <Navbar.Collapse id="dashboard-nav">
          <Nav className="me-auto">
            {links.map(link => (
              <Nav.Link key={link.to} as={Link} to={link.to}>
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="align-items-lg-center gap-lg-2">
            <Navbar.Text>{user?.full_name}</Navbar.Text>
            <Badge bg="light" text="dark">{roleLabel}</Badge>
            <Nav.Link as={Link} to={profileTo}>Mi Perfil</Nav.Link>
            <Button variant="light" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
