import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

const headers = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getProfile = (id) =>
  axios.get(`${API}/usuarios/${id}`, headers());

export const updateProfile = (id, datos) =>
  axios.put(`${API}/usuarios/${id}`, datos, headers());

export const getAll = () =>
  axios.get(`${API}/usuarios`, headers());

export const deleteUser = (id) =>
  axios.delete(`${API}/usuarios/${id}`, headers());

export const restoreUser = (id) =>
  axios.patch(`${API}/usuarios/${id}/restore`, {}, headers());
