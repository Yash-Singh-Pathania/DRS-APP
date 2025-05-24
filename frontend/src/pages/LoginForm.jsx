import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Divider, 
  CircularProgress,
  useTheme 
} from '@mui/material';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signin = useAuthStore((state) => state.signin);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signin({ email, password });
    setLoading(false);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
        Welcome Back
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
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
      />
      
      <TextField 
        label="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
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
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
      
      <Button 
        variant="text" 
        color="secondary" 
        onClick={() => navigate('/signup')}
        sx={{ mb: 1 }}
      >
        Don't have an account? Sign Up
      </Button>
      
      <Button 
        variant="text" 
        color="secondary" 
        onClick={() => navigate('/otp-verify', { state: { email } })}
      >
        Verify Email (OTP)
      </Button>
    </Box>
  );
};

export default LoginForm;
