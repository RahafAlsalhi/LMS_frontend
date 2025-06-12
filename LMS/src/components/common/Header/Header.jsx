import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  InputBase,
  Chip,
  useScrollTrigger,
  Slide,
  Container,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@store/slices/authSlice";
import GoogleAuth from "@components/auth/GoogleAuth";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    handleProfileClose();
    navigate("/");
  };

  const navItems = [
    { label: "Courses", path: "/courses" },
    { label: "Contact us", path: "/contact" },
    { label: "About Us", path: "/about" },
  ];

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "primary.light",
          color: "text.primary",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo */}
            <Box
              display="flex"
              alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <SchoolIcon
                sx={{
                  fontSize: 32,
                  color: "primary.main",
                  mr: 1,
                  transform: "rotate(-10deg)",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                EduHikerz
              </Typography>
            </Box>

            {/* Search Bar - Desktop */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                backgroundColor: "grey.50",
                borderRadius: 2,
                px: 2,
                py: 0.5,
                minWidth: 300,
                border: "1px solid",
                borderColor: "grey.200",
                "&:focus-within": {
                  borderColor: "primary.main",
                  boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.1)",
                },
              }}
            >
              <SearchIcon sx={{ color: "grey.500", mr: 1 }} />
              <InputBase
                placeholder="Search EduHikerz"
                sx={{ flex: 1, fontSize: "0.9rem" }}
              />
            </Box>

            {/* Navigation - Desktop */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "primary.50",
                      color: "primary.main",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Auth Section */}
              {isAuthenticated ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate("/dashboard")}
                    variant="outlined"
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.50",
                      },
                    }}
                  >
                    Dashboard
                  </Button>

                  <IconButton onClick={handleProfileClick}>
                    <Avatar
                      src={user?.avatar}
                      sx={{
                        width: 36,
                        height: 36,
                        background:
                          "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "primary.main",
                      fontWeight: 500,
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                      boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={handleMobileMenuClick}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 200,
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Chip
              label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              color={
                user?.role === "admin"
                  ? "error"
                  : user?.role === "instructor"
                  ? "warning"
                  : "primary"
              }
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleProfileClose();
            }}
          >
            <PersonIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/dashboard");
              handleProfileClose();
            }}
          >
            <DashboardIcon sx={{ mr: 1 }} /> Dashboard
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <LoginIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 250,
            },
          }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                navigate(item.path);
                handleMobileMenuClose();
              }}
            >
              {item.label}
            </MenuItem>
          ))}
          {!isAuthenticated && (
            <>
              <MenuItem
                onClick={() => {
                  navigate("/login");
                  handleMobileMenuClose();
                }}
              >
                Sign In
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/register");
                  handleMobileMenuClose();
                }}
              >
                Get Started
              </MenuItem>
            </>
          )}
        </Menu>
      </AppBar>
    </Slide>
  );
};

export default Header;
