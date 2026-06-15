import { authApi, getToken } from './api';

export async function login(email, password) {
  const res = await authApi.login({ email, password });
  localStorage.setItem('token', res.data.token);
  return res.data.user;
}

export function logout() {
  localStorage.removeItem('token');
}

export async function fetchCurrentUser() {
  const res = await authApi.me();
  return res.data;
}

// getToken vive en api.js (única fuente); se reexporta para los consumidores de auth
export { getToken };
