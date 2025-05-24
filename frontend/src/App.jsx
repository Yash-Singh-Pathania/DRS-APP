import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useAuthStore from './stores/authStore';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerify from './pages/OtpVerify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import ScanCoupon from './pages/ScanCoupon';
import PayoutMode from './pages/PayoutMode';
import CouponList from './pages/CouponList';

// Loading component with Apple-Duolingo style
const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #F2F9EB 0%, #E8F5FE 100%)',
    }}
  >
    <CircularProgress 
      size={60} 
      thickness={4} 
      sx={{ 
        color: '#78C800',
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round',
        }
      }} 
    />
    <Box 
      sx={{ 
        mt: 3, 
        fontWeight: 600,
        color: '#3C3C3C',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      Loading...
    </Box>
  </Box>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (isAuthenticated === null) {
    // Still checking authentication
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute>
            <ScanCoupon />
          </ProtectedRoute>
        } />
        <Route path="/payout" element={
          <ProtectedRoute>
            <PayoutMode />
          </ProtectedRoute>
        } />
        <Route path="/coupons" element={
          <ProtectedRoute>
            <CouponList />
          </ProtectedRoute>
        } />
      </Routes>
  );
}

export default App;
