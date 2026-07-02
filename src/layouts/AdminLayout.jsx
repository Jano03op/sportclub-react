import { Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import DashboardNavbar from '../components/navigation/DashboardNavbar';

export default function AdminLayout() {
  return (
    <div className="theme-admin d-flex flex-column min-vh-100">
      <DashboardNavbar
        links={[
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/users', label: 'Usuarios' },
          { to: '/admin/sports', label: 'Deportes' },
          { to: '/admin/rooms', label: 'Salas' },
          { to: '/admin/assignments', label: 'Asignaciones' },
          { to: '/admin/schedules', label: 'Horarios' },
        ]}
        roleLabel="Admin"
        profileTo="/admin/profile"
      />
      <Container className="py-4 flex-grow-1">
        <Outlet />
      </Container>
    </div>
  );
}
