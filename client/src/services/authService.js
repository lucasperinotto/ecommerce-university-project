import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export const login = ( usuario ) =>
  axios.post(`${API}/auth/login`, usuario);

export const register = ( nuevoUsuario ) =>
  axios.post(`${API}/usuarios/`, nuevoUsuario);

export const forgotPassword = ( mail ) =>
  axios.post(`${API}/auth/forgot-password`, mail);

export const resetPassword = ( nuevaContrasena ) =>
  axios.post(`${API}/auth/reset-password/:token`, nuevaContrasena);
