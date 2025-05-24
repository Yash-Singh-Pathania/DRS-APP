import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  Card,
  CardContent,
  useTheme,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  FlashlightOn,
  FlashlightOff,
  CameraAlt,
  QrCodeScanner,
  Edit
} from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'react-toastify';
import useCouponStore from '../stores/couponStore';

function ScanCoupon() {
  const navigate = useNavigate();
  const { saveCoupon, loading } = useCouponStore();
  const [scanning, setScanning] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [manualEntry, setManualEntry] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const scannerRef = useRef(null);
  const scannerContainerRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(() => {
        setHasCamera(true);
        if (!manualEntry) {
          initializeScanner();
        }
      })
      .catch(() => {
        setHasCamera(false);
        toast.error('Camera access denied or not available');
      });
      
    return () => {
      // Clean up
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error('Error stopping scanner:', err));
      }
    };
  }, [manualEntry]);
  
  const initializeScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(err => console.error('Error stopping scanner:', err));
    }
    
    if (!scannerContainerRef.current || !hasCamera || manualEntry) return;
    
    const html5QrCode = new Html5Qrcode("scanner-container");
    scannerRef.current = html5QrCode;
    
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [Html5Qrcode.FORMATS.EAN_13, Html5Qrcode.FORMATS.EAN_8, Html5Qrcode.FORMATS.CODE_128, Html5Qrcode.FORMATS.CODE_39, Html5Qrcode.FORMATS.QR_CODE]
      },
      handleScanSuccess,
      handleScanError
    ).catch(err => {
      console.error('Error starting scanner:', err);
      setHasCamera(false);
      toast.error('Failed to start camera scanner');
    });
  };

  const handleScanSuccess = async (decodedText) => {
    if (!loading) {
      // Stop scanning temporarily
      if (scannerRef.current) {
        scannerRef.current.pause();
      }
      
      // Extract barcode data
      const barcodeData = {
        barcode: decodedText,
        // You can add value parsing logic here if the barcode contains value information
      };
      
      try {
        const savedCoupon = await saveCoupon(barcodeData);
        if (savedCoupon) {
          toast.success('Coupon saved successfully!');
          navigate('/');
        }
      } catch (error) {
        toast.error('Failed to save coupon');
        // Resume scanning
        if (scannerRef.current) {
          scannerRef.current.resume();
        }
      }
    }
  };

  const handleScanError = (error) => {
    // Don't show errors for normal scanning operations
    if (error !== 'No QR code found') {
      console.error('Scanner error:', error);
    }
  };
  
  const toggleTorch = () => {
    if (scannerRef.current) {
      if (torchOn) {
        scannerRef.current.disableTorch();
      } else {
        scannerRef.current.enableTorch();
      }
      setTorchOn(!torchOn);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) {
      toast.error('Please enter a valid barcode');
      return;
    }
    
    try {
      const barcodeData = {
        barcode: barcodeInput.trim(),
      };
      
      const savedCoupon = await saveCoupon(barcodeData);
      if (savedCoupon) {
        toast.success('Coupon saved successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to save coupon');
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
            Scan DRS Coupon
          </Typography>
          {hasCamera && (
            <IconButton 
              color="inherit" 
              onClick={toggleTorch}
              aria-label="toggle flashlight"
            >
              {torchOn ? <FlashlightOff /> : <FlashlightOn />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        {!manualEntry && hasCamera ? (
          <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
            <CardContent sx={{ p: 3 }}>
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
                  <QrCodeScanner sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography 
                  variant="h5" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.text.primary
                  }}
                >
                  Scan Coupon
                </Typography>
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  color: theme.palette.text.secondary
                }}
              >
                Position the barcode within the frame to scan automatically
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Paper 
                elevation={0} 
                sx={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: 2,
                  mb: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper
                }}
              >
                <div 
                  id="scanner-container" 
                  ref={scannerContainerRef}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    position: 'relative'
                  }}
                ></div>
                {loading && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      zIndex: 2
                    }}
                  >
                    <CircularProgress color="primary" />
                  </Box>
                )}
              </Paper>
              
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => setManualEntry(true)}
                startIcon={<Edit />}
                fullWidth
                sx={{ 
                  height: 44
                }}
              >
                Enter Barcode Manually
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
            <CardContent sx={{ p: 3 }}>
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
                  <Edit sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography 
                  variant="h5" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.text.primary
                  }}
                >
                  Manual Entry
                </Typography>
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  color: theme.palette.text.secondary
                }}
              >
                Enter the barcode number manually if scanning doesn't work
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box 
                component="form" 
                onSubmit={handleManualSubmit}
                sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column'
                }}
              >
                <TextField
                  label="Barcode Number"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  variant="outlined"
                  InputProps={{
                    sx: { height: 56 }
                  }}
                  sx={{ mb: 3 }}
                />
                
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  {hasCamera && (
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      fullWidth
                      onClick={() => setManualEntry(false)}
                      startIcon={<CameraAlt />}
                      sx={{ height: 44 }}
                    >
                      Use Camera
                    </Button>
                  )}
                  
                  <Button 
                    variant="contained" 
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{ height: 44 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Coupon'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

export default ScanCoupon;
