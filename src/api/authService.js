import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  async signup(userData) {
    try {
      const response = await api.post('/api/auth/signup', userData);
      return { success: true, message: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Registration failed' 
      };
    }
  },

  async verifyOtp(email, otp) {
    try {
      const response = await api.post('/api/auth/verify', null, {
        params: { email, otp }
      });
      return { success: true, message: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'OTP verification failed' 
      };
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.startsWith('Bearer ')) {
        localStorage.setItem('authToken', response.data);
        return { success: true, token: response.data };
      }
      return { success: false, message: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Login failed' 
      };
    }
  }
};