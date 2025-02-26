import axios from 'axios';

export const BASE_URL = 'https://noble-liberation-production.up.railway.app';

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add an interceptor to include token in requests
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

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  GET_USER_DATA: '/api/auth/getuserdata',
  SEARCH_TAXIS: '/api/auth/available-taxis',
  SEND_OTP: '/api/auth/send-otp',
  VERIFY_OTP: '/api/auth/verify-otp',
  CREATE_BOOKING: '/api/auth/create'
};

// Generic function for API requests
const apiRequest = async (method, url, data = {}) => {
  try {
    const response = await api({ method, url, data });
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error.response?.data || error.message);
    throw error.response?.data || error.message || 'An unknown error occurred';
  }
};

// Test API request separately in case of failure
const testAPIRequest = async (method, url, data = {}) => {
  try {
    const response = await axios({ method, url: `${BASE_URL}${url}`, data, withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(`Direct API Error (${method} ${url}):`, error.response?.data || error.message);
    throw error.response?.data || error.message || 'An unknown error occurred';
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => apiRequest('POST', API_ENDPOINTS.LOGIN, { email, password }),
  signup: (userData) => apiRequest('POST', API_ENDPOINTS.SIGNUP, userData),
  getUserData: () => apiRequest('GET', API_ENDPOINTS.GET_USER_DATA)
};

// Taxi API
export const taxiAPI = {
  getAvailableTaxis: (formData) => apiRequest('POST', API_ENDPOINTS.SEARCH_TAXIS, formData)
};

// Booking API
export const bookingAPI = {
  sendOTP: (data) => apiRequest('POST', API_ENDPOINTS.SEND_OTP, data),
  verifyOTP: (data) => apiRequest('POST', API_ENDPOINTS.VERIFY_OTP, data),
  createBooking: (data) => apiRequest('POST', API_ENDPOINTS.CREATE_BOOKING, data)
};