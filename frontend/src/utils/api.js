import axios from 'axios';
import { showError } from './message';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true,
});

// 请求拦截器可以加token（如果需要）
// api.interceptors.request.use(config => {...});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      showError('Session expired, please login again.');
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // 直接跳登录
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default api;
