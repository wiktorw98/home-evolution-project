// frontend/src/utils/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// To jest "interceptor" - funkcja, która przechwytuje każde zapytanie
// zanim zostanie ono wysłane.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Jeśli mamy token, dołączamy go do nagłówka 'Authorization'
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;