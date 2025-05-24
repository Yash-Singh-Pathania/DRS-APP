import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  QrCode2,
  Close,
  AddCircleOutline
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import useCouponStore from '../stores/couponStore';
import Barcode from 'react-barcode';

function PayoutMode() {
  const navigate = useNavigate();
  const { fetchCoupons, coupons, loading, markCouponAsUsed, selectCoupon, selectedCoupon } = useCouponStore();
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    // Fetch unused coupons on component mount
    fetchCoupons(false);
  }, [fetchCoupons]);

  const handleSelectCoupon = (coupon) => {
    setCurrentCoupon(coupon);
    setPayoutDialogOpen(true);
  };

  const handleMarkAsUsed = async () => {
    if (currentCoupon) {
      try {
        await markCouponAsUsed(currentCoupon.id);
        toast.success('Coupon marked as used');
        setPayoutDialogOpen(false);
        // Refresh the list
        fetchCoupons(false);
      } catch (error) {
        toast.error('Failed to mark coupon as used');
      }
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: theme.palette.background.default
    }}>
      <AppBar position="static" elevation={0} color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            aria-label="back"
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Payout Mode
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ flex: 1, py: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : coupons.filter(c => !c.is_used).length === 0 ? (
          <Card elevation={0} sx={{ textAlign: 'center', py: 6, px: 3, backgroundColor: 'transparent', border: `1px dashed ${theme.palette.divider}` }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <QrCode2 sx={{ fontSize: 30, color: theme.palette.text.secondary }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  No Unused Coupons
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  You don't have any unused coupons to redeem
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/scan')}
                startIcon={<AddCircleOutline />}
                sx={{ mt: 2, height: 44 }}
              >
                Scan New Coupon
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Available Coupons
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select a coupon to display in payout mode
                </Typography>
              </CardContent>
            </Card>
            
            <Box sx={{ width: '100%' }}>
              {coupons
                .filter(coupon => !coupon.is_used)
                .map((coupon, index) => (
                  <Card 
                    key={coupon.id} 
                    elevation={1} 
                    sx={{ 
                      mb: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[3]
                      }
                    }}
                    onClick={() => handleSelectCoupon(coupon)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {coupon.barcode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Scanned: {new Date(coupon.scanned_at).toLocaleDateString()}
                          </Typography>
                          {coupon.value && (
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 600, 
                                color: theme.palette.primary.main,
                                mt: 1
                              }}
                            >
                              {coupon.value} {coupon.currency}
                            </Typography>
                          )}
                        </Box>
                        <IconButton 
                          color="primary"
                          size="medium"
                          sx={{ 
                            backgroundColor: 'rgba(76, 175, 80, 0.1)'
                          }}
                        >
                          <QrCode2 fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* Payout Dialog - Full Screen White Background with Barcode */}
      <Dialog
        fullScreen
        open={payoutDialogOpen}
        onClose={() => setPayoutDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#FFFFFF',
            boxShadow: 'none'
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: 3,
            backgroundColor: '#FFFFFF'
          }}
          className="payout-mode"
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton
              onClick={() => setPayoutDialogOpen(false)}
              sx={{ 
                color: theme.palette.text.primary,
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }
              }}
              size="large"
            >
              <Close />
            </IconButton>
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2, 
              backgroundColor: theme.palette.primary.main,
              color: '#FFFFFF'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center',
                fontWeight: 600,
                color: '#FFFFFF'
              }}
            >
              Show this to the cashier
            </Typography>
          </Paper>
          
          <Card 
            elevation={2} 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              mb: 4
            }}
          >
            {currentCoupon && (
              <>
                <Box sx={{ mb: 4, mt: 2 }}>
                  <Barcode 
                    value={currentCoupon.barcode} 
                    width={2}
                    height={100}
                    fontSize={16}
                    margin={10}
                    background="#FFFFFF"
                    lineColor="#000000"
                  />
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: theme.palette.background.default,
                  width: '100%',
                  textAlign: 'center',
                  mb: 3
                }}>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                    Barcode
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentCoupon.barcode}
                  </Typography>
                </Box>
                
                {currentCoupon.value && (
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    backgroundColor: theme.palette.primary.main,
                    width: '100%',
                    textAlign: 'center',
                    mb: 2
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                      Value
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                      {currentCoupon.value} {currentCoupon.currency}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Card>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleMarkAsUsed}
            sx={{ 
              py: 1.5,
              borderRadius: 2,
              height: 56,
              fontSize: '1rem',
              fontWeight: 600
            }}
            fullWidth
          >
            Mark as Used
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

export default PayoutMode;
