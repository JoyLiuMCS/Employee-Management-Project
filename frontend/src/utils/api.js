import axios from 'axios';
import { showError } from './message';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

// ⭐加上请求拦截器，自动带上 Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // ⭐必须加
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 保持你原来写的response拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      showError('Session expired, please login again.');
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');  // ⭐顺手也清掉user
        window.location.href = '/login';
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default api;
