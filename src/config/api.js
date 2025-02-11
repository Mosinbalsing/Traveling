import axios from 'axios';

// export const API_BASE_URL = 'http://localhost:3000';  // For local development

// Use the correct Railway URL
const BASE_URL = 'https://noble-liberation-production.up.railway.app';

// Create axios instance with simpler config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  config => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('🔴 Network Error - Server might be down or URL incorrect');
    } else {
      console.error('🔴 Response Error:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  GET_USER_DATA: '/api/auth/getuserdata'
};

// API functions
export const authAPI = {
  login: (email, password) => 
    axiosInstance.post(API_ENDPOINTS.LOGIN, { email, password })
      .then(response => response.data),

  signup: (userData) => 
    axiosInstance.post(API_ENDPOINTS.SIGNUP, userData)
      .then(response => response.data),

  getUserData: (token) => 
    axiosInstance.get(API_ENDPOINTS.GET_USER_DATA, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data)
};

export default authAPI; 