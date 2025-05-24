import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  CircularProgress,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  useTheme
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  ArrowForward,
  CheckCircleOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';

const Signup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = () => {
    return password.length >= 8 && password === confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await signup({ email, password, name });
    setLoading(false);
    if (result.success) {
      toast.success('Signup successful! Please check your email for the OTP.');
      navigate('/otp-verify', { state: { email } });
    } else {
      toast.error(result.error || 'Signup failed');
    }
  };
  
  const steps = ['Account Details', 'Password Setup', 'Confirmation'];

  // Form content based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Account Details
        return (
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              required
              margin="normal"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: theme.palette.primary.main, opacity: 0.8 }} />
                  </InputAdornment>
                ),
                sx: { 
                  height: 56, 
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                  }
                }
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: theme.palette.primary.main, opacity: 0.8 }} />
                  </InputAdornment>
                ),
                sx: { 
                  height: 56, 
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                  }
                }
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              endIcon={<ArrowForward />}
              onClick={handleNext}
              disabled={!email || !name || !validateEmail()}
              sx={{ 
                py: 1.5,
                height: 56,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: '0 10px 20px rgba(120, 200, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 30px rgba(120, 200, 0, 0.25)',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 70%)`
                }
              }}
            >
              Continue
            </Button>
          </Box>
        );
      case 1: // Password Setup
        return (
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              required
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                ),
                sx: { 
                  height: 56, 
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                  }
                }
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.primary.main, opacity: 0.8 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  height: 56, 
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                  }
                }
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleBack}
                sx={{ 
                  width: '48%',
                  height: 56,
                  borderRadius: '12px',
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(120, 200, 0, 0.08)'
                  }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowForward />}
                onClick={handleNext}
                disabled={!validatePassword()}
                sx={{ 
                  width: '48%',
                  height: 56,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: '0 10px 20px rgba(120, 200, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(120, 200, 0, 0.25)',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 70%)`
                  }
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        );
      case 2: // Confirmation
        return (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                backgroundColor: 'rgba(120, 200, 0, 0.1)', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}
            >
              <CheckCircleOutline sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Almost there!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.secondary }}>
              Please review your information before creating your account.
            </Typography>
            <Box sx={{ textAlign: 'left', mb: 4, p: 3, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {name}
              </Typography>
              <Typography variant="body1">
                <strong>Password:</strong> ••••••••
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                onClick={handleBack}
                sx={{ 
                  width: '48%',
                  height: 56,
                  borderRadius: '12px',
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(120, 200, 0, 0.08)'
                  }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ 
                  width: '48%',
                  height: 56,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: '0 10px 20px rgba(120, 200, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(120, 200, 0, 0.25)',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 70%)`
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

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
              Create Your <Box component="span" sx={{ color: theme.palette.primary.main }}>Wallet</Box> Today
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
              Sign up to manage your recycling rewards securely in one place.
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
                Join 5,000+ users managing their rewards
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 3,
              background: theme.palette.primary.main,
              borderRadius: 4
            }
          }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.primary.main,
                mr: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>D</Typography>
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                color: '#2D3748'
              }}
            >
              Create Account
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: theme.palette.text.secondary
            }}
          >
            Join DRS Wallet to manage your rewards
          </Typography>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              width: '100%', 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme.palette.primary.main
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.primary.main
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
          {activeStep === steps.length && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Account created successfully!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ 
                  mt: 2,
                  height: 56,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: '0 10px 20px rgba(120, 200, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(120, 200, 0, 0.25)',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 70%)`
                  }
                }}
              >
                Go to Login
              </Button>
            </Box>
          )}
          {activeStep !== steps.length && activeStep !== 0 && activeStep !== 1 && activeStep !== 2 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={handleBack}
                sx={{ 
                  width: '48%',
                  height: 56,
                  borderRadius: '12px',
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(120, 200, 0, 0.08)'
                  }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ 
                  width: '48%',
                  height: 56,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: '0 10px 20px rgba(120, 200, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(120, 200, 0, 0.25)',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 70%)`
                  }
                }}
              >
                Continue
              </Button>
            </Box>
          )}
          {activeStep === 0 && (
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
                Already have an account?
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
                onClick={() => navigate('/login')}
              >
                Sign In
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;
