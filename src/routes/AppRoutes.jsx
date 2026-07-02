import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Recover from '../pages/Recover';
import ProfilePage from '../pages/ProfilePage';

import UserDashboard from '../pages/user/UserDashboard';
import CoachDashboard from '../pages/coach/CoachDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersPage from '../pages/admin/UsersPage';
import SportsPage from '../pages/admin/SportsPage';
import RoomsPage from '../pages/admin/RoomsPage';
import AssignmentsPage from '../pages/admin/AssignmentsPage';
import SchedulesPage from '../pages/admin/SchedulesPage';

import UserLayout from '../layouts/UserLayout';
import CoachLayout from '../layouts/CoachLayout';
import AdminLayout from '../layouts/AdminLayout';

import RoleRoute from './RoleRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover" element={<Recover />} />

        <Route
          path="/user"
          element={
            <RoleRoute role="user">
              <UserLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/coach"
          element={
            <RoleRoute role="coach">
              <CoachLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sports" element={<SportsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
