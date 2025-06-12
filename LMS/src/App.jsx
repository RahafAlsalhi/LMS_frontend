import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "@store/index";
import theme from "@styles/theme";

// Pages
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";
import About from "@pages/About";
import Contact from "@pages/Contact";
import Terms from "@pages/Terms";
import Privacy from "@pages/Privacy";
import Cookies from "@pages/Cookies";
import Help from "@pages/Help";
import NotFound from "@pages/NotFound";

// Dashboard Pages
import Dashboard from "@pages/Dashboard/Dashboard";
import StudentDashboard from "@components/dashboard/StudentDashboard";
import InstructorDashboard from "@components/dashboard/InstructorDashboard";
import AdminDashboard from "@components/dashboard/AdminDashboard";
// Admin Management Components (these files need to be created)
import AdminUserManagement from "@components/admin/AdminUserManagement";
import AdminCourseApproval from "@components/admin/AdminCourseApproval";
import AdminRoute from "@components/admin/AdminRoutes";
import GetAllUsers from "./components/dashboard/AdminDashboard/GetAllUsers";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/help" element={<Help />} />

              {/* Protected Dashboard Route */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Direct dashboard routes for development/testing */}
              <Route path="/StudentDashboard" element={<StudentDashboard />} />
              <Route
                path="/InstructorDashboard"
                element={<InstructorDashboard />}
              />
              <Route path="/AdminDashboard" element={<AdminDashboard />} />

              {/* 🆕 ADMIN MANAGEMENT ROUTES */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUserManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <AdminRoute>
                    <AdminCourseApproval />
                  </AdminRoute>
                }
              />

              {/* Default admin redirect */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/GetAllUsers"
                element={
                  <AdminRoute>
                    <GetAllUsers />
                  </AdminRoute>
                }
              />

              {/* 404 - Keep at bottom */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
