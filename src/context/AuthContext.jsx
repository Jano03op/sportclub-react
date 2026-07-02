import { useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Solo hay que esperar si existe un token que validar contra la API
  const [loading, setLoading] = useState(() => Boolean(authService.getToken()));

  useEffect(() => {
    if (!authService.getToken()) return;
    authService.fetchCurrentUser()
      .then(user => setUser(user))
      .catch(() => authService.logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const user = await authService.login(email, password);
    setUser(user);
    return user;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  // Permite reflejar en toda la app (ej: navbar) los cambios hechos en Mi Perfil
  function updateUser(updatedFields) {
    setUser(prev => ({ ...prev, ...updatedFields }));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
