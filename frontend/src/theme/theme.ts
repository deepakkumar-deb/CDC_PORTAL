"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#003366",
      light: "#1a5799",
      dark: "#001f3f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#C8922A",
      light: "#E5B04A",
      dark: "#A0721A",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F8F7F3",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: "-0.01em" },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    subtitle1: { fontFamily: '"Inter", sans-serif', fontWeight: 500 },
    subtitle2: { fontFamily: '"Inter", sans-serif', fontWeight: 500 },
    body1: { fontFamily: '"Inter", sans-serif', lineHeight: 1.6 },
    body2: { fontFamily: '"Inter", sans-serif', lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 700, fontFamily: '"Outfit", sans-serif' },
  },
  shape: { borderRadius: 10 }, // Slightly more rounded for premium feel
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "0.9rem",
        },
        containedPrimary: {
          boxShadow: "0 4px 14px rgba(0,51,102,0.25)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(0,51,102,0.35)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.38)", // Significantly darker than default
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.55)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#003366",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
