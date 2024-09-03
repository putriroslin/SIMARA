// components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Mock function to check authentication status
const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  // Check if access token exists
  return !!accessToken;
};

// PrivateRoute component
const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
