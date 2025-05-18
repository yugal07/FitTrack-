import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthGuard from '../components/auth/AuthGuard';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserList from '../components/admin/users/UserList';
import UserDetail from '../components/admin/users/UserDetail';
import AnalyticsDashboard from '../components/admin/analytics/AnalyticsDashboard';
import ExerciseManager from '../components/admin/content/ExerciseManager';
import WorkoutManager from '../components/admin/content/WorkoutManager';
import NutritionManager from '../components/admin/content/NutritionManager';
import AnnouncementCreator from '../components/admin/notifications/AnnouncementCreator';
import NotificationHistory from '../components/admin/notifications/NotificationHistory';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={
        <AuthGuard requireAdmin={true}>
          <AdminLayout />
        </AuthGuard>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="exercises" element={<ExerciseManager />} />
        <Route path="workouts" element={<WorkoutManager />} />
        <Route path="nutrition" element={<NutritionManager />} />
        <Route path="announcements" element={<AnnouncementCreator />} />
        <Route path="notifications" element={<NotificationHistory />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;