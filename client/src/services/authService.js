import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export const login = (mail, contrasena) =>
  axios.post(`${API}/auth/login`, { mail, contrasena });

export const register = (datos) =>
  axios.post(`${API}/auth/register`, datos);

export const forgotPassword = (mail) =>
  axios.post(`${API}/auth/forgot-password`, { mail });

export const resetPassword = (token, nuevaContrasena) =>
  axios.post(`${API}/auth/reset-password`, { token, nuevaContrasena });
