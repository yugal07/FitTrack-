// src/routes/AdminRoutes.jsx (Using dedicated AdminRoute guard)
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminRoute from '../components/auth/AdminRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserList from '../pages/admin/UserList';
import ExercisesList from '../pages/admin/ExercisesList';
import SendNotifications from '../pages/admin/SendNotifications';

// Admin User Management Pages - These will be created later
const UserActivity = () => <div>User Activity</div>;

// Admin Content Management Pages - These will be created later
const WorkoutsList = () => <div>Workouts Management</div>;
const NutritionDatabase = () => <div>Nutrition Database</div>;
const FlaggedContent = () => <div>Flagged Content</div>;

// Admin Analytics Pages - These will be created later
const UsageMetrics = () => <div>Usage Metrics</div>;
const UserEngagement = () => <div>User Engagement</div>;
const GrowthMetrics = () => <div>Growth & Retention</div>;

// Admin Notification Pages - These will be created later
const Announcements = () => <div>Announcements</div>;
const NotificationTemplates = () => <div>Notification Templates</div>;

// Admin Settings Pages - These will be created later
const SystemConfig = () => <div>System Configuration</div>;
const AdminAccounts = () => <div>Admin Accounts</div>;
const SecuritySettings = () => <div>Security Settings</div>;

const AdminRoutes = ({ toggleTheme, darkMode }) => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <AdminRoute>
            <AdminLayout toggleTheme={toggleTheme} darkMode={darkMode} />
          </AdminRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* User Management */}
        <Route path="users" element={<UserList />} />
        <Route path="users/activity" element={<UserActivity />} />
        
        {/* Content Management */}
        <Route path="content/workouts" element={<WorkoutsList />} />
        <Route path="content/exercises" element={<ExercisesList />} />
        <Route path="content/nutrition" element={<NutritionDatabase />} />
        <Route path="content/flagged" element={<FlaggedContent />} />
        
        {/* Analytics */}
        <Route path="analytics/usage" element={<UsageMetrics />} />
        <Route path="analytics/engagement" element={<UserEngagement />} />
        <Route path="analytics/growth" element={<GrowthMetrics />} />
        
        {/* Notifications */}
        <Route path="notifications/announcements" element={<Announcements />} />
        <Route path="notifications/send" element={<SendNotifications />} />
        <Route path="notifications/templates" element={<NotificationTemplates />} />
        
        {/* Settings */}
        <Route path="settings/config" element={<SystemConfig />} />
        <Route path="settings/admins" element={<AdminAccounts />} />
        <Route path="settings/security" element={<SecuritySettings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;