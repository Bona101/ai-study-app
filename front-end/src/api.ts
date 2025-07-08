// src/api.ts
import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';
import { type ApiResponse, type ApiErrorResponse } from './types'; // Import your types

const API_BASE_URL = 'http://localhost:5000/api'; // Your backend URL

// Create an Axios instance
const api: AxiosInstance = axios.create({
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
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response, // Type the response data
  (error: AxiosError<ApiErrorResponse>) => { // Type the error response data
    if (error.response && error.response.status === 403 && error.response.data?.error === 'Invalid or expired token.') {
      console.log("Token expired or invalid. Logging out...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login page if not already there
      // Note: This needs to be handled outside of React's render cycle or via history API
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;