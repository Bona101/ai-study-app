// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
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

// Response interceptor to handle expired tokens (optional, but good practice)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403 && error.response.data.error === 'Invalid or expired token.') {
      // Token expired or invalid, handle logout
      console.log("Token expired or invalid. Logging out...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login page if not already there
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;