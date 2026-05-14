import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? '';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('task_saas_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadAuth = Boolean(localStorage.getItem('task_saas_token'));
      localStorage.removeItem('task_saas_token');
      localStorage.removeItem('task_saas_user');
      if (hadAuth && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
