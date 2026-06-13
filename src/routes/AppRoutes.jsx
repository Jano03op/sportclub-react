import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Recover from '../pages/Recover';

import UserDashboard from '../pages/user/UserDashboard';
import CoachDashboard from '../pages/coach/CoachDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersPage from '../pages/admin/UsersPage';

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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
