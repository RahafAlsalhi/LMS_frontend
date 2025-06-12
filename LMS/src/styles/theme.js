import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#64B5F6", // Light blue
      main: "#2196F3", // Main blue 
      dark: "#1976D2", // Dark blue
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#81C784",
      main: "#4CAF50", // Green for success states
      dark: "#388E3C",
      contrastText: "#FFFFFF",
    },
    error: {
      light: "#EF5350",
      main: "#F44336",
      dark: "#C62828",
      contrastText: "#FFFFFF",
    },
    warning: {
      light: "#FF9800",
      main: "#FF9800",
      dark: "#F57C00",
      contrastText: "#FFFFFF",
    },
    info: {
      light: "#29B6F6",
      main: "#0288D1",
      dark: "#0277BD",
      contrastText: "#FFFFFF",
    },
    success: {
      light: "#66BB6A",
      main: "#4CAF50",
      dark: "#388E3C",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      color: "#212121",
    },
    h2: {
      fontSize: "2.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
      color: "#212121",
    },
    h3: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: "#212121",
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: "#212121",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#212121",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#212121",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#424242",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#616161",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 8px rgba(33, 150, 243, 0.08)",
    "0px 4px 12px rgba(33, 150, 243, 0.12)",
    "0px 6px 16px rgba(33, 150, 243, 0.15)",
    "0px 8px 20px rgba(33, 150, 243, 0.18)",
    "0px 10px 24px rgba(33, 150, 243, 0.20)",
    "0px 12px 28px rgba(33, 150, 243, 0.22)",
    "0px 14px 32px rgba(33, 150, 243, 0.24)",
    "0px 16px 36px rgba(33, 150, 243, 0.26)",
    "0px 18px 40px rgba(33, 150, 243, 0.28)",
    "0px 20px 44px rgba(33, 150, 243, 0.30)",
    "0px 22px 48px rgba(33, 150, 243, 0.32)",
    "0px 24px 52px rgba(33, 150, 243, 0.34)",
    "0px 26px 56px rgba(33, 150, 243, 0.36)",
    "0px 28px 60px rgba(33, 150, 243, 0.38)",
    "0px 30px 64px rgba(33, 150, 243, 0.40)",
    "0px 32px 68px rgba(33, 150, 243, 0.42)",
    "0px 34px 72px rgba(33, 150, 243, 0.44)",
    "0px 36px 76px rgba(33, 150, 243, 0.46)",
    "0px 38px 80px rgba(33, 150, 243, 0.48)",
    "0px 40px 84px rgba(33, 150, 243, 0.50)",
    "0px 42px 88px rgba(33, 150, 243, 0.52)",
    "0px 44px 92px rgba(33, 150, 243, 0.54)",
    "0px 46px 96px rgba(33, 150, 243, 0.56)",
    "0px 48px 100px rgba(33, 150, 243, 0.58)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "0.95rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(33, 150, 243, 0.25)",
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 4px 20px rgba(33, 150, 243, 0.08)",
          "&:hover": {
            boxShadow: "0px 8px 30px rgba(33, 150, 243, 0.15)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease-in-out",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(33, 150, 243, 0.1)",
          boxShadow: "0px 2px 20px rgba(33, 150, 243, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
