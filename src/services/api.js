const BASE_URL = 'http://localhost:3000/api';

export function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Si la respuesta no es JSON válido (ej: error inesperado del servidor),
  // se sigue adelante con data = null para no perder el status
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error(data?.message || `Error ${res.status} en la solicitud`);
    error.errors = data?.errors;
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

export const sportsApi = {
  getAll: () => request('/sports'),
  getById: (id) => request(`/sports/${id}`),
  create: (body) => request('/sports', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/sports/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/sports/${id}`, { method: 'DELETE' }),
  changeStatus: (id, status) => request(`/sports/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export const roomsApi = {
  getAll: () => request('/rooms'),
  getById: (id) => request(`/rooms/${id}`),
  create: (body) => request('/rooms', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
};

// Asignaciones Deporte + Sala + Coach
export const sportRoomsApi = {
  getAll: () => request('/sport-rooms'),
  getById: (id) => request(`/sport-rooms/${id}`),
  create: (body) => request('/sport-rooms', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/sport-rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/sport-rooms/${id}`, { method: 'DELETE' }),
};

export const schedulesApi = {
  getAll: () => request('/class-schedules'),
  getById: (id) => request(`/class-schedules/${id}`),
  create: (body) => request('/class-schedules', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/class-schedules/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/class-schedules/${id}`, { method: 'DELETE' }),
};

export const coachApi = {
  getDashboard: () => request('/coach/dashboard'),
  getMyClasses: () => request('/coach/my-classes'),
  getMySchedules: () => request('/coach/my-schedules'),
  getMyRooms: () => request('/coach/my-rooms'),
};

export const memberApi = {
  getDashboard: () => request('/member/dashboard'),
  getClasses: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/member/classes${params ? `?${params}` : ''}`);
  },
  getClassById: (id) => request(`/member/classes/${id}`),
  getSports: () => request('/member/sports'),
  getRooms: () => request('/member/rooms'),
};

export const reservationsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/reservations${params ? `?${params}` : ''}`);
  },
  getMyReservations: () => request('/reservations/my-reservations'),
  create: (body) => request('/reservations', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id) => request(`/reservations/${id}/cancel`, { method: 'PATCH' }),
};
