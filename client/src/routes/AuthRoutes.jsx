import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import { useAuth } from '../contexts/AuthContext';

const AuthRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to dashboard if already authenticated
  const RedirectIfAuthenticated = ({ children }) => {
    return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
  };
  
  return (
    <Routes>
      <Route path="/login" element={
        <RedirectIfAuthenticated>
          <Login />
        </RedirectIfAuthenticated>
      } />
      <Route path="/register" element={
        <RedirectIfAuthenticated>
          <Register />
        </RedirectIfAuthenticated>
      } />
      <Route path="/forgot-password" element={
        <RedirectIfAuthenticated>
          <ForgotPassword />
        </RedirectIfAuthenticated>
      } />
      <Route path="/reset-password" element={
        <RedirectIfAuthenticated>
          <ResetPassword />
        </RedirectIfAuthenticated>
      } />
    </Routes>
  );
};

export default AuthRoutes;