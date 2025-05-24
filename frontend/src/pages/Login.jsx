import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  TextField, 
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForward
} from '@mui/icons-material';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signin = useAuthStore((state) => state.signin);
  const theme = useTheme();
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signin({ email, password });
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        placeholder="Enter your email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            height: 56,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
              backgroundColor: 'rgba(255, 255, 255, 1)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.1)'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: theme.palette.primary.main, opacity: 0.8 }} />
            </InputAdornment>
          ),
          placeholder: "Enter your email"
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        placeholder="Enter your password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            height: 56,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
              backgroundColor: 'rgba(255, 255, 255, 1)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.1)'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: theme.palette.primary.main, opacity: 0.8 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
                sx={{ color: theme.palette.text.secondary }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{ 
                color: theme.palette.primary.main,
                '&.Mui-checked': {
                  color: theme.palette.primary.main
                }
              }} 
            />
          }
          label={
            <Typography variant="body2" color="textSecondary">
              Remember me
            </Typography>
          }
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.primary.main, 
            fontWeight: 500,
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </Typography>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        endIcon={!loading && <ArrowForward />}
        sx={{ 
          py: 1.5,
          height: 56,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: '12px',
          background: theme.palette.primary.main,
          boxShadow: '0 10px 20px rgba(120, 200, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 15px 30px rgba(120, 200, 0, 0.25)',
            background: theme.palette.primary.dark
          }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
    </Box>
  );
}

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // If already authenticated, redirect to home
    if (useAuthStore.getState().isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Box 
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-5%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120, 200, 0, 0.1) 0%, rgba(120, 200, 0, 0.05) 70%)',
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-5%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(28, 176, 246, 0.1) 0%, rgba(28, 176, 246, 0.05) 70%)',
          zIndex: 0
        }
      }}
    >
      {!isMobile && (
        <Box 
          sx={{
            flex: '1 1 50%',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            p: 4,
            zIndex: 1
          }}
        >
          <Box 
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              maxWidth: 500,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'left',
              p: 4
            }}
          >
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 4
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: theme.palette.primary.main,
                  mr: 2,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>D</Typography>
              </Box>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 800, 
                  color: theme.palette.primary.main,
                  letterSpacing: '-0.5px'
                }}
              >
                DRS Wallet
              </Typography>
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 3, 
                color: '#2D3748',
                lineHeight: 1.3
              }}
            >
              Manage Your <Box component="span" sx={{ color: theme.palette.primary.main }}>Recycling Rewards</Box>
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary', 
                mb: 5,
                fontWeight: 400,
                opacity: 0.8
              }}
            >
              Securely store and manage your recycling rewards in one convenient place.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                p: 2,
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                width: '100%'
              }}
            >
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '10px', 
                  backgroundColor: 'rgba(120, 200, 0, 0.1)', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <Box 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: '50%', 
                    backgroundColor: theme.palette.primary.main 
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Over 10,000 users trust DRS Wallet
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Box 
        sx={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 480,
            p: { xs: 3, sm: 5 },
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: theme.palette.primary.main,
              zIndex: 1
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: '#2D3748'
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: theme.palette.text.secondary
            }}
          >
            Sign in to continue to your account
          </Typography>

          <LoginForm />

          <Box 
            sx={{ 
              mt: 4, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                mr: 1
              }}
            >
              Don't have an account?
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.primary.main, 
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;
