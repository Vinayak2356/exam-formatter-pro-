import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchPatterns = async () => {
  const response = await api.get('/patterns');
  return response.data;
};

export const fetchStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const createPattern = async (pattern: any) => {
  const response = await api.post('/patterns', pattern);
  return response.data;
};

export const updatePattern = async (id: number, pattern: any) => {
  const response = await api.put(`/patterns/${id}`, pattern);
  return response.data;
};

export const deletePattern = async (id: number) => {
  await api.delete(`/patterns/${id}`);
};
