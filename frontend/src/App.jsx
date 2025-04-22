import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnboardingPage from "./pages/employee/OnboardingPage";
import ProfilePage from "./pages/employee/ProfilePage";
import VisaStatusPage from "./pages/employee/VisaStatusPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/visa-status" element={<VisaStatusPage />} />
      </Routes>
      <Routes>
  <Route path="/" element={<div>👋 Home Page</div>} />
  <Route path="/onboarding" element={<OnboardingPage />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;

