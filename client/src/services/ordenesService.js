import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const crearOrden = (datos) =>
  axios.post(`${API}/ordenes`, datos, headers());

export const getMisOrdenes = (userId) =>
  axios.get(`${API}/ordenes/usuario/${userId}`, headers());

export const getTodasOrdenes = () =>
  axios.get(`${API}/ordenes`, headers());
