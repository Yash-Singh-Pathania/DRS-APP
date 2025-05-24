import { createTheme } from '@mui/material/styles';

// Material Design theme with Duolingo colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Material Design green
      light: '#80E27E',
      dark: '#087F23',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2196F3', // Material Design blue
      light: '#6EC6FF',
      dark: '#0069C0',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F44336', // Material Design red
      light: '#FF7961',
      dark: '#BA000D',
    },
    warning: {
      main: '#FFC107', // Material Design amber
      light: '#FFF350',
      dark: '#C79100',
    },
    info: {
      main: '#2196F3', // Material Design blue
      light: '#64B5F6',
      dark: '#0D47A1',
    },
    success: {
      main: '#4CAF50', // Material Design green
      light: '#81C784',
      dark: '#388E3C',
    },
    background: {
      default: '#FFFFFF', // Pure white background
      paper: '#F5F5F5',   // Material Design grey 100
    },
    text: {
      primary: '#212121', // Material Design grey 900
      secondary: '#757575', // Material Design grey 600
      disabled: '#BDBDBD', // Material Design grey 400
    },
    divider: '#E0E0E0', // Material Design grey 300
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none', // Apple style - no text transform
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontWeight: 400,
      fontSize: '0.625rem',
      lineHeight: 1.5,
      letterSpacing: '0.08333em',
    },
  },
  spacing: 8, // 8px base spacing unit
  shape: {
    borderRadius: 12, // 12px border radius for all elements
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.1)', // Subtle shadow for cards
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 3px 6px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.1)',
    '0 5px 10px rgba(0,0,0,0.1)',
    '0 6px 12px rgba(0,0,0,0.1)',
    '0 7px 14px rgba(0,0,0,0.1)',
    '0 8px 16px rgba(0,0,0,0.1)',
    '0 9px 18px rgba(0,0,0,0.1)',
    '0 10px 20px rgba(0,0,0,0.1)',
    '0 11px 22px rgba(0,0,0,0.1)',
    '0 12px 24px rgba(0,0,0,0.1)',
    '0 13px 26px rgba(0,0,0,0.1)',
    '0 14px 28px rgba(0,0,0,0.1)',
    '0 15px 30px rgba(0,0,0,0.1)',
    '0 16px 32px rgba(0,0,0,0.1)',
    '0 17px 34px rgba(0,0,0,0.1)',
    '0 18px 36px rgba(0,0,0,0.1)',
    '0 19px 38px rgba(0,0,0,0.1)',
    '0 20px 40px rgba(0,0,0,0.1)',
    '0 21px 42px rgba(0,0,0,0.1)',
    '0 22px 44px rgba(0,0,0,0.1)',
    '0 23px 46px rgba(0,0,0,0.1)',
    '0 24px 48px rgba(0,0,0,0.1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: 44, // 44px height for buttons
          borderRadius: 4, // Material Design default radius
          padding: '8px 16px',
          transition: 'all 120ms ease-in-out',
          textTransform: 'none',
          fontWeight: 500, // Material Design medium weight
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', // Material Design shadow
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)', // Material Design shadow level 2
          },
        },
        outlined: {
          borderWidth: 1, // Material Design uses 1px borders
          '&:hover': {
            borderWidth: 1,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.08)', // Primary color with low opacity
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 120ms ease-in-out',
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#78C800',
                borderWidth: 2,
              },
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#78C800',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#78C800',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          transition: 'all 300ms ease',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          height: 32,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 600,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(120, 200, 0, 0.08)',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#78C800',
              opacity: 1,
              border: 'none',
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#78C800',
            border: '6px solid #fff',
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 26 / 2,
          border: '1px solid #E0E0E0',
          backgroundColor: '#E0E0E0',
          opacity: 1,
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 120, // Micro-animations: 120ms
      shorter: 200,
      short: 250,
      standard: 300, // Page transitions: 300ms
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

export default theme;
