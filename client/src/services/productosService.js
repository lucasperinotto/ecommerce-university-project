import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getProductos = () => axios.get(`${API_URL}/productos`);
export const getProductoById = (id) => axios.get(`${API_URL}/productos/${id}`);
