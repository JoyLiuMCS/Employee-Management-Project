import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import OnboardingPage from '../pages/employee/OnboardingPage';
import ProfilePage from '../pages/employee/ProfilePage';
import VisaStatusPage from '../pages/employee/VisaStatusPage';

import DashboardPage from '../pages/hr/DashboardPage';
import ApplicationReview from '../pages/hr/ApplicationReview';
import EmployeeProfiles from '../pages/hr/EmployeeProfiles';
import VisaReviewPage from '../pages/hr/VisaReviewPage';

import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:token" element={<RegisterPage />} />

      {/* Protected Employee routes */}
      <Route path="/onboarding" element={
        <ProtectedRoute><OnboardingPage /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      } />
      <Route path="/visa-status" element={
        <ProtectedRoute><VisaStatusPage /></ProtectedRoute>
      } />
      {/* Protected HR routes */}
      <Route path="/hr/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/hr/application-review" element={
        <ProtectedRoute><ApplicationReview /></ProtectedRoute>
      } />
      <Route path="/hr/employee-profiles" element={
        <ProtectedRoute><EmployeeProfiles /></ProtectedRoute>
      } />
      <Route path="/hr/visa-review" element={
        <ProtectedRoute><VisaReviewPage /></ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
