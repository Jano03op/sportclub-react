const BASE_URL = 'http://localhost:3000/api';

export function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Error en la solicitud');
    error.errors = data.errors;
    error.status = res.status;
    throw error;
  }
  return data;
}

export const authApi = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  updateMe: (body) => request('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => request('/auth/me/password', { method: 'PUT', body: JSON.stringify(body) }),
};

export const usersApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/users${params ? `?${params}` : ''}`);
  },
  getById: (id) => request(`/users/${id}`),
  create: (body) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};
