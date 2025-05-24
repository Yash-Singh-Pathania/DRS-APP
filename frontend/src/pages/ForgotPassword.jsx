import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent,
  Container, 
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await requestPasswordReset({ email });
    setLoading(false);
    if (result.success) {
      toast.success('OTP sent! Check your email.');
      navigate('/reset-password', { state: { email } });
    } else {
      toast.error(result.error || 'Could not send OTP');
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(3)
    }}>
      <Container maxWidth="sm">
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.palette.primary.main,
                  mr: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <LockResetOutlinedIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography 
                variant="h5" 
                component="h1" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary
                }}
              >
                Forgot Password?
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color: theme.palette.text.secondary
              }}
            >
              Enter your email to receive a password reset code
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField 
                label="Email Address" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                fullWidth 
                margin="normal" 
                required 
                type="email"
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
                  height: 44,
                  mb: 2
                }} 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Code'}
              </Button>
              
              <Button 
                variant="text" 
                color="secondary" 
                onClick={() => navigate('/login')}
                sx={{ mt: 1 }}
              >
                Back to Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
