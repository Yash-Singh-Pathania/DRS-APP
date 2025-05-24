import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: null,
  token: localStorage.getItem('token') || null,
  
  // Signup
  signup: async ({ email, password, name }) => {
    try {
      const response = await axios.post('/api/auth/signup', { email, password, name });
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.response?.data?.detail || error.message };
    }
  },

  // Signin
  signin: async ({ email, password }) => {
    try {
      const response = await axios.post('/api/auth/signin', { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, user, isAuthenticated: true });
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      return { success: true };
    } catch (error) {
      set({ isAuthenticated: false, user: null, token: null });
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return { success: false, error: error?.response?.data?.detail || error.message };
    }
  },

  // OTP Verification
  verifyOtp: async ({ email, otp }) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.response?.data?.detail || error.message };
    }
  },

  // Resend OTP
  resendOtp: async ({ email }) => {
    try {
      const response = await axios.post('/api/auth/resend-otp', { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.response?.data?.detail || error.message };
    }
  },

  // Request Password Reset
  requestPasswordReset: async ({ email }) => {
    try {
      const response = await axios.post('/api/auth/request-password-reset', { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.response?.data?.detail || error.message };
    }
  },

  // Reset Password
  resetPassword: async ({ email, otp, newPassword }) => {
    try {
      const response = await axios.post('/api/auth/reset-password', { email, otp, new_password: newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.response?.data?.detail || error.message };
    }
  },
  
  // Check if user is authenticated
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }
    
    try {
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch current user data
      const response = await axios.get('/api/auth/me');
      set({ 
        user: response.data,
        isAuthenticated: true,
        token
      });
      return true;
    } catch (error) {
      // Invalid token or other error
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ isAuthenticated: false, user: null, token: null });
      return false;
    }
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, isAuthenticated: false, token: null });
  }
}));

export default useAuthStore;
