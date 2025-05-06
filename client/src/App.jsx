// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthGuard from './components/auth/AuthGuard';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import ChangePassword from './components/auth/ChangePassword';

// Placeholder components for future development
const Workouts = () => <div className="text-gray-900 dark:text-white">Workouts page (to be implemented)</div>;
const Progress = () => <div className="text-gray-900 dark:text-white">Progress page (to be implemented)</div>;
const Nutrition = () => <div className="text-gray-900 dark:text-white">Nutrition page (to be implemented)</div>;
const Goals = () => <div className="text-gray-900 dark:text-white">Goals page (to be implemented)</div>;
const Profile = () => (
  <div className="space-y-6">
    <div className="text-gray-900 dark:text-white text-lg font-medium">Profile Settings</div>
    <ChangePassword />
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/workouts" element={
              <AuthGuard>
                <Layout>
                  <Workouts />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/progress" element={
              <AuthGuard>
                <Layout>
                  <Progress />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/nutrition" element={
              <AuthGuard>
                <Layout>
                  <Nutrition />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/goals" element={
              <AuthGuard>
                <Layout>
                  <Goals />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <Layout>
                  <Profile />
                </Layout>
              </AuthGuard>
            } />
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;