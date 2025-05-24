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
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const email = location.state?.email || '';
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await resetPassword({ email, otp, newPassword });
    setLoading(false);
    if (result.success) {
      toast.success('Password reset! You can now log in.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Could not reset password');
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
                <LockOutlinedIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography 
                variant="h5" 
                component="h1" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary
                }}
              >
                Reset Password
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color: theme.palette.text.secondary
              }}
            >
              Enter the verification code sent to <Box component="span" sx={{ fontWeight: 500 }}>{email}</Box> and create a new password
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField 
                label="Verification Code" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                fullWidth 
                margin="normal" 
                required
                InputProps={{
                  sx: { height: 56 }
                }}
              />
              
              <TextField 
                label="New Password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                fullWidth 
                margin="normal" 
                required 
                type="password"
                InputProps={{
                  sx: { height: 56 }
                }}
              />
              
              <TextField 
                label="Confirm Password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                fullWidth 
                margin="normal" 
                required 
                type="password"
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
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

export default ResetPassword;
