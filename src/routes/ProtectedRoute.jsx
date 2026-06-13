import { Navigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 gap-2">
        <Spinner animation="border" />
        <span className="text-muted">Cargando...</span>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
