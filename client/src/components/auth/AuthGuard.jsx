import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Protect routes that require authentication
const AuthGuard = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, currentUser, loading } = useAuth();
  const location = useLocation();

  // If authentication is loading, show loading spinner
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated()) {
    // Store the last location to redirect back after login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Define user-only routes that admins should not access
  const userOnlyRoutes = [
    '/dashboard',
    '/workouts',
    '/progress',
    '/nutrition',
    '/goals',
    '/profile',
    '/notifications',
    '/scheduled-workouts',
  ];

  // Check if current path is a user-only route
  const isUserOnlyRoute = userOnlyRoutes.some(
    route =>
      location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  // Admin route protection: Prevent admins from accessing user routes
  if (isAdmin() && isUserOnlyRoute && !requireAdmin) {
    console.log(`Admin redirect: ${location.pathname} -> /admin/dashboard`);
    return <Navigate to='/admin/dashboard' replace />;
  }

  // Check if route requires admin and user is not admin
  if (requireAdmin && !isAdmin()) {
    // Redirect to dashboard if user is not admin
    return <Navigate to='/dashboard' replace />;
  }

  // Special case: If this is the dashboard route and the user is an admin, redirect to admin dashboard
  if (location.pathname === '/dashboard' && isAdmin()) {
    return <Navigate to='/admin/dashboard' replace />;
  }

  // Handle root path redirect based on role
  if (location.pathname === '/') {
    if (isAdmin()) {
      return <Navigate to='/admin/dashboard' replace />;
    } else {
      return <Navigate to='/dashboard' replace />;
    }
  }

  // User is authenticated and has appropriate permissions, render the children
  return children;
};

export default AuthGuard;
