"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#800000",
      light: "#A00000",
      dark: "#600000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#C8922A",
      light: "#E5B04A",
      dark: "#A0721A",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F5F5F5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 4 }, // Sharp, professional edges
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: "8px 20px",
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.42)", // Standard distinct border
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#800000",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme;
