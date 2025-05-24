import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Grid,
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardContent,
  Avatar,
  useTheme
} from '@mui/material';
import {
  QrCodeScannerOutlined,
  ListAltOutlined,
  PaymentOutlined,
  LogoutOutlined,
  HomeOutlined,
  AccountCircleOutlined
} from '@mui/icons-material';
import useAuthStore from '../stores/authStore';
import useCouponStore from '../stores/couponStore';

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { fetchCoupons, coupons } = useCouponStore();
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  useEffect(() => {
    // Fetch unused coupons on component mount
    fetchCoupons(false);
  }, [fetchCoupons]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #F2F9EB 0%, #E8F5FE 100%)',
      minHeight: '100vh',
      pb: 8
    }}>
      <Container maxWidth="sm">
        <Box sx={{ pt: 4, pb: 10 }}>
        <Card 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: theme.shape.borderRadius,
            background: '#FFFFFF',
            position: 'relative',
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              background: 'linear-gradient(135deg, #78C800 0%, #1CB0F6 100%)',
              borderRadius: theme.shape.borderRadius * 1.2,
              opacity: 0.1,
              zIndex: -1,
            }
          }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                src={user?.profile_picture}
                alt={user?.name || 'User'}
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.primary.main,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}
              >
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Welcome, {user?.name || 'User'}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                {user?.email}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
          Your DRS Coupons
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6}>
            <Card 
              elevation={2} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: theme.shape.borderRadius,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(120, 200, 0, 0.1) 0%, rgba(120, 200, 0, 0.05) 100%)',
                border: '2px solid rgba(120, 200, 0, 0.2)',
                transition: 'all 120ms ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[3]
                }
              }}
            >
              <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1 }}>
                {coupons.filter(c => !c.is_used).length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                Unused Coupons
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card 
              elevation={2} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: theme.shape.borderRadius,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(28, 176, 246, 0.1) 0%, rgba(28, 176, 246, 0.05) 100%)',
                border: '2px solid rgba(28, 176, 246, 0.2)',
                transition: 'all 120ms ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[3]
                }
              }}
            >
              <Typography variant="h3" sx={{ color: theme.palette.secondary.main, fontWeight: 700, mb: 1 }}>
                {coupons.filter(c => c.is_used).length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                Used Coupons
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
          Quick Actions
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={<QrCodeScannerOutlined />}
              onClick={() => navigateTo('/scan')}
              sx={{ 
                py: 1.5, 
                height: 56,
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(120, 200, 0, 0.3)'
              }}
            >
              Scan New Coupon
            </Button>
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              variant="outlined" 
              fullWidth 
              size="large"
              color="secondary"
              startIcon={<PaymentOutlined />}
              onClick={() => navigateTo('/payout')}
              sx={{ 
                py: 1.5, 
                height: 56,
                fontSize: '1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2
                }
              }}
              disabled={coupons.filter(c => !c.is_used).length === 0}
            >
              Payout Mode
            </Button>
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              color="error"
              fullWidth 
              size="large"
              startIcon={<LogoutOutlined />}
              onClick={handleLogout}
              sx={{ 
                py: 1.5, 
                height: 56,
                fontSize: '1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2
                }
              }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Box>

      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        sx={{ 
          width: '100%', 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          height: 70,
          boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.05)',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
          '& .MuiBottomNavigationAction-root': {
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }
        }}
      >
        <BottomNavigationAction 
          label="Home" 
          icon={<HomeOutlined />} 
          onClick={() => navigateTo('/')}
        />
        <BottomNavigationAction 
          label="Scan" 
          icon={<QrCodeScannerOutlined />} 
          onClick={() => navigateTo('/scan')}
        />
        <BottomNavigationAction 
          label="Coupons" 
          icon={<ListAltOutlined />} 
          onClick={() => navigateTo('/coupons')}
        />
        <BottomNavigationAction 
          label="Payout" 
          icon={<PaymentOutlined />} 
          onClick={() => navigateTo('/payout')}
        />
      </BottomNavigation>
      </Container>
    </Box>
  );
}

export default Home;
