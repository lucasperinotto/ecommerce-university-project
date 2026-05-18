import axios from 'axios';

export const getProductos = () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/productos`);
export const getProductoById = (id) => axios.get(`${import.meta.env.VITE_API_BASE_URL}/productos/${id}`);