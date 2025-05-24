import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  Container, 
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';
import RefreshIcon from '@mui/icons-material/Refresh';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);
  const email = location.state?.email || '';
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('OTP is required');
      return;
    }
    setLoading(true);
    const result = await verifyOtp({ email, otp });
    setLoading(false);
    if (result.success) {
      toast.success('Email verified! You can now sign in.');
      navigate('/login');
    } else {
      toast.error(result.error || 'OTP verification failed');
    }
  };

  const handleResend = async () => {
    setResending(true);
    const result = await resendOtp({ email });
    setResending(false);
    if (result.success) {
      toast.success('OTP resent! Check your email.');
    } else {
      toast.error(result.error || 'Could not resend OTP');
    }
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #F2F9EB 0%, #E8F5FE 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(3)
    }}>
      <Container maxWidth="sm">
        <Card
          elevation={2}
          sx={{
            padding: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 480,
            borderRadius: theme.shape.borderRadius * 1.5,
            background: '#FFFFFF',
            overflow: 'visible',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -8,
              left: -8,
              right: -8,
              bottom: -8,
              background: 'linear-gradient(135deg, #78C800 0%, #1CB0F6 100%)',
              borderRadius: theme.shape.borderRadius * 2,
              opacity: 0.1,
              zIndex: -1,
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #78C800 0%, #58C2F9 100%)',
                mr: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <VerifiedOutlinedIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.main,
                letterSpacing: '-0.5px'
              }}
            >
              Verify Email
            </Typography>
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              textAlign: 'center', 
              color: theme.palette.text.secondary, 
              fontWeight: 500,
              maxWidth: '85%'
            }}
          >
            We've sent a verification code to <Box component="span" sx={{ fontWeight: 600 }}>{email}</Box>
          </Typography>
          
          <Divider sx={{ width: '100%', mb: 3, opacity: 0.6 }} />
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField 
              label="Enter verification code" 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              fullWidth 
              margin="normal" 
              required 
              InputProps={{
                sx: { height: 56 }
              }}
              sx={{ mb: 3 }}
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ 
                height: 56,
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(120, 200, 0, 0.3)'
              }} 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
            </Button>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button 
                variant="text" 
                color="secondary"
                onClick={() => navigate('/signup')}
              >
                Back to Signup
              </Button>
              
              <Button
                startIcon={<RefreshIcon />}
                variant="text"
                color="secondary"
                onClick={handleResend}
                disabled={resending}
                sx={{ fontWeight: 600 }}
              >
                {resending ? <CircularProgress size={16} color="inherit" /> : 'Resend Code'}
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default OtpVerify;
