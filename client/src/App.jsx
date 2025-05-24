import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
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
import Workouts from './components/workout/Workouts';
import Notifications from './components/notifications/Notifications';

// Scheduled Workout Components
import ScheduledWorkoutList from './components/workout/ScheduledWorkoutList';
import ScheduledWorkoutDetail from './components/workout/ScheduledWorkoutDetail';
import ScheduledWorkoutForm from './components/workout/ScheduledWorkoutForm';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import UserList from './components/admin/users/UserList';
import UserDetail from './components/admin/users/UserDetail';
import AnalyticsDashboard from './components/admin/analytics/AnalyticsDashboard';
import ExerciseManager from './components/admin/content/ExerciseManager';
import WorkoutManager from './components/admin/content/WorkoutManager';
import NutritionManager from './components/admin/content/NutritionManager';
import AnnouncementCreator from './components/admin/notifications/AnnouncementCreator';
import NotificationHistory from './components/admin/notifications/NotificationHistory';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />

              {/* Protected user routes */}

              <Route
                path='/dashboard'
                element={
                  <AuthGuard>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/workouts'
                element={
                  <AuthGuard>
                    <Layout>
                      <Workouts />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/progress'
                element={
                  <AuthGuard>
                    <Layout>
                      <Progress />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/nutrition'
                element={
                  <AuthGuard>
                    <Layout>
                      <Nutrition />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/goals'
                element={
                  <AuthGuard>
                    <Layout>
                      <Goals />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/profile'
                element={
                  <AuthGuard>
                    <Layout>
                      <Profile />
                    </Layout>
                  </AuthGuard>
                }
              />

              {/* Scheduled Workout Routes */}
              <Route
                path='/scheduled-workouts'
                element={
                  <AuthGuard>
                    <Layout>
                      <ScheduledWorkoutList />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/scheduled-workouts/new'
                element={
                  <AuthGuard>
                    <Layout>
                      <ScheduledWorkoutForm />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/scheduled-workouts/:id'
                element={
                  <AuthGuard>
                    <Layout>
                      <ScheduledWorkoutDetail />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/scheduled-workouts/:id/edit'
                element={
                  <AuthGuard>
                    <Layout>
                      <ScheduledWorkoutForm />
                    </Layout>
                  </AuthGuard>
                }
              />

              <Route
                path='/dashboard'
                element={
                  <AuthGuard>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/workouts'
                element={
                  <AuthGuard>
                    <Layout>
                      <Workouts />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/progress'
                element={
                  <AuthGuard>
                    <Layout>
                      <Progress />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/nutrition'
                element={
                  <AuthGuard>
                    <Layout>
                      <Nutrition />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/goals'
                element={
                  <AuthGuard>
                    <Layout>
                      <Goals />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/profile'
                element={
                  <AuthGuard>
                    <Layout>
                      <Profile />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path='/notifications'
                element={
                  <AuthGuard>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </AuthGuard>
                }
              />

              {/* Admin routes */}
              <Route
                path='/admin'
                element={
                  <AuthGuard requireAdmin={true}>
                    <AdminLayout />
                  </AuthGuard>
                }
              >
                <Route
                  index
                  element={<Navigate to='/admin/dashboard' replace />}
                />
                <Route path='dashboard' element={<AdminDashboard />} />
                <Route path='users' element={<UserList />} />
                <Route path='users/:id' element={<UserDetail />} />
                <Route path='analytics' element={<AnalyticsDashboard />} />
                <Route path='exercises' element={<ExerciseManager />} />
                <Route path='workouts' element={<WorkoutManager />} />
                <Route path='nutrition' element={<NutritionManager />} />
                <Route path='announcements' element={<AnnouncementCreator />} />
                <Route path='notifications' element={<NotificationHistory />} />
              </Route>

              {/* Redirects */}
              <Route path='/' element={<Navigate to='/dashboard' />} />
              <Route path='*' element={<Navigate to='/dashboard' />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
