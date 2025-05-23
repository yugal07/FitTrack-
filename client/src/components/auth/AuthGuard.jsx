import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Protect routes that require authentication
const AuthGuard = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, currentUser, loading } = useAuth();
  const location = useLocation();

  // If authentication is loading, show nothing
  if (loading) {
    return null;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated()) {
    // Store the last location to redirect back after login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Check if route requires admin and user is not admin
  if (requireAdmin && !isAdmin()) {
    // Redirect to dashboard if user is not admin
    return <Navigate to='/dashboard' replace />;
  }

  // If this is the dashboard route and the user is an admin, redirect to admin dashboard
  if (location.pathname === '/dashboard' && isAdmin()) {
    return <Navigate to='/admin/dashboard' replace />;
  }

  // User is authenticated and has appropriate permissions, render the children
  return children;
};

export default AuthGuard;
