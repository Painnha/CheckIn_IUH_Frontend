import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

export const participantsAPI = {
  checkIn: async (id) => {
    const response = await api.post('/participants/checkin', { id });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/participants/stats');
    return response.data;
  },
  import: async () => {
    const response = await api.post('/participants/import');
    return response.data;
  },
};

export default api;

