import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/useAuth';
import logo from '../assets/logo_empresa_letra_v1.png';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="text-center">
        <img src={logo} width="320" alt="SportClub" className="img-fluid mb-4" />
        <p className="lead text-muted mb-4">Sistema de gestión de club deportivo</p>

        {user ? (
          <Button as={Link} to={`/${user.role}/dashboard`} variant="primary" size="lg">
            Ir al panel
          </Button>
        ) : (
          <Button as={Link} to="/login" variant="primary" size="lg">
            Iniciar sesión
          </Button>
        )}
      </div>
    </div>
  );
}
