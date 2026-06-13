import { Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import DashboardNavbar from '../components/navigation/DashboardNavbar';

export default function CoachLayout() {
  return (
    <div className="theme-coach d-flex flex-column min-vh-100">
      <DashboardNavbar
        links={[{ to: '/coach/dashboard', label: 'Dashboard' }]}
        roleLabel="Entrenador"
        profileTo="/coach/dashboard"
      />
      <Container className="py-4 flex-grow-1">
        <Outlet />
      </Container>
    </div>
  );
}
