import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <BrowserRouter>
        <App />
        <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          theme="colored"
          toastStyle={{
            borderRadius: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
