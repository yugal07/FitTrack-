// src/App.jsx
import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './styles/theme';
import { AuthProvider } from './context/AuthContext';

// Layout components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Page components
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import NotFound from './pages/NotFound';

// Workout pages
import WorkoutPage from './pages/workout/WorkoutPage';
import WorkoutDetailPage from './pages/workout/WorkoutDetailPage';
import WorkoutFormPage from './pages/workout/WorkoutFormPage';
import WorkoutSessionPage from './pages/workout/WorkoutSessionPage';
import WorkoutHistoryPage from './pages/workout/WorkoutHistoryPage';

// Progress components
import WorkoutPerformance from './components/progress/WorkoutPerformance';
import MeasurementsTracker from './components/progress/MeasurementTracker';
import PhotoComparison from './components/progress/PhotoComparision';

function App() {
  // Check if dark mode preference is stored in localStorage
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  const [darkMode, setDarkMode] = useState(savedDarkMode);
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  // Apply stored theme on initial load
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      setDarkMode(stored === 'true');
    } else {
      // Check system preference if no stored preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
      localStorage.setItem('darkMode', prefersDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout toggleTheme={toggleTheme} darkMode={darkMode} />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Workout routes - note the order matters! */}
                <Route path="/workouts/create" element={<WorkoutFormPage />} />
                <Route path="/workouts/:id/edit" element={<WorkoutFormPage />} />
                <Route path="/workouts/:id/start" element={<WorkoutSessionPage />} />
                <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
                <Route path="/workouts" element={<WorkoutPage />} />
                <Route path="/workout-history" element={<WorkoutHistoryPage />} />
                
                {/* Progress routes */}
                <Route path="/progress" element={<Progress />} />
                <Route path="/progress/workout" element={<WorkoutPerformance />} />
                <Route path="/progress/measurements" element={<MeasurementsTracker />} />
                <Route path="/progress/photos" element={<PhotoComparison />} />
              </Route>
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;