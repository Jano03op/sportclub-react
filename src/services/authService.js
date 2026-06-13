import { authApi } from './api';

export const authService = {
  async login(email, password) {
    const res = await authApi.login({ email, password });
    localStorage.setItem('token', res.data.token);
    return res.data.user;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async fetchCurrentUser() {
    const res = await authApi.me();
    return res.data;
  },
};
