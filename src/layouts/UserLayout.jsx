import { Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import DashboardNavbar from '../components/navigation/DashboardNavbar';

export default function UserLayout() {
  return (
    <div className="theme-user d-flex flex-column min-vh-100">
      <DashboardNavbar
        links={[{ to: '/user/dashboard', label: 'Dashboard' }]}
        roleLabel="Usuario"
        profileTo="/user/profile"
      />
      <Container className="py-4 flex-grow-1">
        <Outlet />
      </Container>
    </div>
  );
}
