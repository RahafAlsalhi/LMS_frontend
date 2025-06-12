import React from "react";
import ProtectedRoute from "./ProtectedRoute";

const InstructorRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="instructor">
      {children}
    </ProtectedRoute>
  );
};

export default InstructorRoute;