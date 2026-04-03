'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#003366',
      light: '#1a5799',
      dark: '#001f3f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#C8922A',
      light: '#E5B04A',
      dark: '#A0721A',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8F7F3',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '10px 24px',
          fontSize: '0.9rem',
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(0,51,102,0.25)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,51,102,0.35)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
  },
});

export default theme;