import { createContext, useContext, useState } from 'react';
import { login as loginSvc, register as registerSvc } from '../services/authService';

const AuthContext = createContext(null);

function leerUsuario() {
  try { return JSON.parse(localStorage.getItem('usuario')); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuario);

  const login = async (mail, contrasena) => {
    const { data } = await loginSvc(mail, contrasena);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  };

  const register = async (datos) => {
    const { data } = await registerSvc(datos);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('carrito');
    setUsuario(null);
  };

  const actualizarUsuario = (nuevosDatos) => {
    const updated = { ...usuario, ...nuevosDatos };
    localStorage.setItem('usuario', JSON.stringify(updated));
    setUsuario(updated);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, register, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
