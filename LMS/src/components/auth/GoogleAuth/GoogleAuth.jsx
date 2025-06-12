import React from "react";
import { Button, Box } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";

const GoogleAuth = ({
  onSuccess,
  onError,
  disabled = false,
  text = "Continue with Google",
}) => {
  const dispatch = useDispatch();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured =
    GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "your-google-client-id";

  // Handle Google OAuth login by redirecting to backend
  const handleGoogleLogin = () => {
    try {
      // Redirect to your backend's Google OAuth endpoint
      window.location.href = `${API_URL}/auth/google`;
    } catch (error) {
      console.error("Google login error:", error);
      if (onError) {
        onError(error);
      }
    }
  };

  // Mock login for development
  const handleMockGoogleLogin = async () => {
    try {
      // Create a mock user for development
      const mockUser = {
        id: "mock-google-id-123",
        email: "demo@example.com",
        name: "Demo User",
        role: "student",
        avatar_url: "https://via.placeholder.com/150",
        oauth_provider: "google",
        oauth_id: "mock-google-id-123",
      };

      // You would need to create a mock login endpoint or simulate the login
      // For now, we'll just call the success handler
      if (onSuccess) {
        onSuccess({ user: mockUser });
      }
    } catch (error) {
      console.error("Mock Google login error:", error);
      if (onError) {
        onError(error);
      }
    }
  };

  if (!isGoogleConfigured) {
    return (
      <Box>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleMockGoogleLogin}
          disabled={disabled}
          sx={{
            py: 1.5,
            borderColor: "grey.300",
            color: "text.primary",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "primary.50",
            },
            "&:disabled": {
              opacity: 0.6,
            },
          }}
        >
          {text} (Demo Mode)
        </Button>
        <Box
          sx={{
            mt: 1,
            p: 1,
            backgroundColor: "warning.50",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "warning.200",
          }}
        >
          <Box
            sx={{
              fontSize: "0.75rem",
              color: "warning.700",
              textAlign: "center",
            }}
          >
            💡 Google OAuth not configured. Using demo mode.
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
      disabled={disabled}
      sx={{
        py: 1.5,
        borderColor: "grey.300",
        color: "text.primary",
        textTransform: "none",
        fontWeight: 500,
        "&:hover": {
          borderColor: "primary.main",
          backgroundColor: "primary.50",
        },
        "&:disabled": {
          opacity: 0.6,
        },
      }}
    >
      {text}
    </Button>
  );
};

export default GoogleAuth;
