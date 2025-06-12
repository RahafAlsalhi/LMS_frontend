// components/auth/GoogleCallback.js
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { handleGoogleCallback } from "@store/slices/authSlice";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check if there's an error from Google OAuth
        const error = searchParams.get("error");
        if (error) {
          console.error("Google OAuth error:", error);
          navigate("/login", {
            state: {
              message: "Google authentication failed. Please try again.",
              type: "error",
            },
          });
          return;
        }

        // If successful, get the user info
        const result = await dispatch(handleGoogleCallback()).unwrap();

        if (result.user) {
          // Redirect to dashboard or intended page
          const from = localStorage.getItem("intendedRoute") || "/dashboard";
          localStorage.removeItem("intendedRoute");
          navigate(from, { replace: true });
        } else {
          throw new Error("No user data received");
        }
      } catch (error) {
        console.error("Callback processing error:", error);
        navigate("/login", {
          state: {
            message: "Authentication failed. Please try again.",
            type: "error",
          },
        });
      }
    };

    processCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Completing Google sign-in...
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Please wait while we verify your Google account
      </Typography>
    </Box>
  );
};

export default GoogleCallback;
