import axios from 'axios';
import { showError } from './message';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',  // ❗没有 /api
  withCredentials: true,
});

// ⭐请求拦截器：自动加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⭐响应拦截器：401自动跳回登录
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      showError('Session expired, please login again.');
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');  // ✅也清掉user
        window.location.href = '/login';
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default api;
