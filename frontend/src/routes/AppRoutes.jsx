import { BrowserRouter,Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import OnboardingPage from '../pages/employee/OnboardingPage';
import ProfilePage from '../pages/employee/ProfilePage';
import VisaStatusPage from '../pages/employee/VisaStatusPage';


const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:token" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/visa-status" element={<VisaStatusPage />} />
    </Routes>
  );
};

export default AppRoutes;
