// src/components/admin/AdminRoutes.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../dashboard/AdminDashboard/AdminDashboard";
import AdminUserManagement from "./AdminUserManagement";
import AdminCourseApproval from "./AdminCourseApproval";
import GetAllUsers from "../dashboard/AdminDashboard/GetAllUsers";
import adminAPI from "../../services/adminAPI";
import { FullScreenLoader } from "@components/common/LoadingSpinner";
import Catogery from "./Catogery"; // Match the actual component name
// Protected Route wrapper with async auth check
const ProtectedAdminRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await adminAPI.isAdminAuthenticated();
        setAuthState({
          loading: false,
          isAuthenticated,
        });
      } catch (error) {
        console.error("Admin auth check failed:", error);
        setAuthState({
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  if (authState.loading) {
    return <FullScreenLoader message="Checking admin access..." />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Admin Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      {/* User Management */}
      <Route
        path="/users"
        element={
          <ProtectedAdminRoute>
            <AdminUserManagement />
          </ProtectedAdminRoute>
        }
      />

      {/* Get All Users - This is the route you were trying to access */}
      <Route
        path="/GetAllUsers"
        element={
          <ProtectedAdminRoute>
            <GetAllUsers />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/Catogery"
        element={
          <ProtectedAdminRoute>
            <Catogery /> {/* Make sure component name matches import */}
          </ProtectedAdminRoute>
        }
      />
      {/* Course Management */}
      <Route
        path="/courses"
        element={
          <ProtectedAdminRoute>
            <AdminCourseApproval />
          </ProtectedAdminRoute>
        }
      />

      {/* Default redirect to dashboard - ONLY for exact /admin path */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Remove the catch-all redirect that was causing the issue */}
      {/* <Route path="*" element={<Navigate to="/admin/dashboard" replace />} /> */}
    </Routes>
  );
};

export default AdminRoutes;
