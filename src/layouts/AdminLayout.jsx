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
        ]}
        roleLabel="Admin"
        profileTo="/admin/dashboard"
      />
      <Container className="py-4 flex-grow-1">
        <Outlet />
      </Container>
    </div>
  );
}
