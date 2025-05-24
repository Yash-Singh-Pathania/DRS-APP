import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  Chip,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Delete,
  QrCode2,
  AddCircleOutline
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import useCouponStore from '../stores/couponStore';

function CouponList() {
  const navigate = useNavigate();
  const { fetchCoupons, coupons, loading, deleteCoupon } = useCouponStore();
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    // Fetch all coupons on component mount
    fetchCoupons();
  }, [fetchCoupons]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Fetch coupons based on tab
    if (newValue === 0) {
      fetchCoupons(); // All coupons
    } else if (newValue === 1) {
      fetchCoupons(false); // Unused coupons
    } else {
      fetchCoupons(true); // Used coupons
    }
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (couponToDelete) {
      try {
        await deleteCoupon(couponToDelete.id);
        toast.success('Coupon deleted successfully');
        setDeleteDialogOpen(false);
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const filteredCoupons = () => {
    if (tabValue === 0) return coupons;
    if (tabValue === 1) return coupons.filter(c => !c.is_used);
    return coupons.filter(c => c.is_used);
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
            My Coupons
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper elevation={0} sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ 
            '& .MuiTab-root': { 
              fontWeight: 500,
              py: 1.5
            } 
          }}
        >
          <Tab label="All" />
          <Tab label="Unused" />
          <Tab label="Used" />
        </Tabs>
      </Paper>

      <Container maxWidth="sm" sx={{ flex: 1, py: 3, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filteredCoupons().length === 0 ? (
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
                  No Coupons Found
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {tabValue === 0 
                    ? "You haven't scanned any coupons yet" 
                    : tabValue === 1 
                      ? "You don't have any unused coupons" 
                      : "You don't have any used coupons"}
                </Typography>
              </Box>
              {tabValue !== 2 && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/scan')}
                  startIcon={<AddCircleOutline />}
                  sx={{ mt: 2, height: 44 }}
                >
                  Scan New Coupon
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ width: '100%' }}>
            {filteredCoupons().map((coupon, index) => (
              <Card 
                key={coupon.id} 
                elevation={1} 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>
                          {coupon.barcode}
                        </Typography>
                        {coupon.is_used ? (
                          <Chip 
                            label="Used" 
                            size="small" 
                            color="default" 
                            sx={{ 
                              height: 24,
                              backgroundColor: 'rgba(0, 0, 0, 0.08)',
                              fontWeight: 500
                            }} 
                          />
                        ) : (
                          <Chip 
                            label="Available" 
                            size="small" 
                            color="primary" 
                            sx={{ 
                              height: 24,
                              fontWeight: 500
                            }} 
                          />
                        )}
                      </Box>
                      <Box sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem', mb: 0.5 }}>
                        Scanned: {new Date(coupon.scanned_at).toLocaleDateString()}
                      </Box>
                      {coupon.is_used && coupon.used_at && (
                        <Box sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem', mb: 0.5 }}>
                          Used: {new Date(coupon.used_at).toLocaleDateString()}
                        </Box>
                      )}
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
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        size="medium"
                        color="primary"
                        onClick={() => navigate('/payout', { state: { coupon } })}
                        disabled={coupon.is_used}
                        sx={{ 
                          mr: 1,
                          backgroundColor: coupon.is_used ? 'transparent' : 'rgba(76, 175, 80, 0.1)'
                        }}
                      >
                        <QrCode2 fontSize="small" color={coupon.is_used ? "disabled" : "primary"} />
                      </IconButton>
                      <IconButton 
                        size="medium"
                        color="error"
                        onClick={() => handleDeleteClick(coupon)}
                        sx={{ 
                          backgroundColor: 'rgba(244, 67, 54, 0.1)'
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Coupon
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2, pt: 1 }}>
          <DialogContentText sx={{ color: theme.palette.text.secondary }}>
            Are you sure you want to delete this coupon? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: 1, textTransform: 'none', minWidth: '80px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 1, textTransform: 'none', minWidth: '80px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CouponList;
