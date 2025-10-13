import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminService from '../services/AdminService';

const ProtectedRoute = ({ children }) => {
  if (!AdminService.isLoggedIn()) {
    // Redirect ke halaman login jika tidak ada session
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
