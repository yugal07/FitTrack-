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
import Profile from './components/profile/Profile';
import Goals from './components/goals/Goals'; 
import Progress from './components/progress/Progress';

import Nutrition from './components/nutrition/Nutrition';

// Placeholder components for future development
import Workouts from './components/workout/Workouts'; 

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