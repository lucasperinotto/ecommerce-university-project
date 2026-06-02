import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getProductos = () =>
  axios.get(`${API}/productos`);

export const getProductoById = (id) =>
  axios.get(`${API}/productos/${id}`);

export const crearProducto = (datos) =>
  axios.post(`${API}/productos`, datos, headers());

export const actualizarProducto = (id, datos) =>
  axios.put(`${API}/productos/${id}`, datos, headers());

export const bajaLogicaProducto = (id) =>
  axios.delete(`${API}/productos/${id}`, headers());

export const restaurarProducto = (id) =>
  axios.patch(`${API}/productos/${id}/restore`, {}, headers());

export const ajustarStock = (id, delta) =>
  axios.patch(`${API}/productos/${id}/stock`, { delta });
