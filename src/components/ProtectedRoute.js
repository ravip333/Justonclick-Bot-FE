import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Check for auth token
  const location = useLocation(); // Get the current location

  // If not authenticated, redirect to login with the original path stored in state
  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  // If authenticated, render the child component
  return children;
};

export default ProtectedRoute;
