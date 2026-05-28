import axios from 'axios';

const API_BASE = 'https://smart-attendance-system-b4s4.vercel.app';

const api = axios.create({
  baseURL: API_BASE
});

// ✅ Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auto logout if token expires
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;