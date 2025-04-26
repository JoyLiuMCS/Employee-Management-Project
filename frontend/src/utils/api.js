import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api', // 你的后端 API 地址
  withCredentials: true, // 如果有跨域 cookie，可以加
});

export default api; // ⭐⭐ 注意加上这一行 ⭐⭐
