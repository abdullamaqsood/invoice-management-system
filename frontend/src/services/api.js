// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://invoice-management-system-production-40bc.up.railway.app/api/',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
