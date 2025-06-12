import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Stack,
  Container,
} from "@mui/material";

// Your existing main LoadingSpinner component
const LoadingSpinner = ({
  size = 40,
  message = "Loading...",
  showMessage = true,
  color = "primary",
  fullHeight = false,
  variant = "indeterminate",
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={fullHeight ? "100vh" : "200px"}
      gap={2}
      sx={{
        padding: 3,
        background: fullHeight
          ? "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)"
          : "transparent",
      }}
    >
      <CircularProgress
        size={size}
        color={color}
        variant={variant}
        thickness={4}
        sx={{
          animationDuration: "1.5s",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      {showMessage && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            textAlign: "center",
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": {
                opacity: 0.6,
              },
              "50%": {
                opacity: 1,
              },
              "100%": {
                opacity: 0.6,
              },
            },
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Full screen loader for initial page loads
export const FullScreenLoader = ({ message = "Loading..." }) => (
  <Container
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      textAlign: "center",
    }}
  >
    <CircularProgress size={60} sx={{ mb: 3 }} />
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
  </Container>
);

// Inline loader for sections within pages
export const InlineLoader = ({ 
  message = "Loading...", 
  height = "200px", 
  size = 40 
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height,
      textAlign: "center",
    }}
  >
    <CircularProgress size={size} sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// 🎯 CardLoader - This was missing!
export const CardLoader = ({ count = 3 }) => (
  <Stack spacing={2}>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
      </Box>
    ))}
  </Stack>
);

// Table loader
export const TableLoader = ({ rows = 5, columns = 4 }) => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box
        key={rowIndex}
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            width={`${100 / columns}%`}
            height={40}
          />
        ))}
      </Box>
    ))}
  </Box>
);

// Small spinner for buttons
export const ButtonLoader = ({ size = 16 }) => (
  <CircularProgress size={size} color="inherit" />
);

// Default export - your existing component
export default LoadingSpinner;