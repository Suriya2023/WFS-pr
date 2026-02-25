import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // If no token, redirect to Register page (as requested) or Login
    // User requested "register page pe lao"
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
