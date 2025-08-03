import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { PageTransitionProvider } from './context/PageTransitionContext';
import LoadingTransition from './components/common/LoadingTransition';
import { usePageTransition } from './context/PageTransitionContext';
import LandingPage from './components/landing/LandingPageResponsive';
import Onboarding from './components/onboarding/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import ClientPortal from './components/portal/ClientPortal';
import EnhancedAssessment from './components/assessment/EnhancedAssessment';
import AssessmentResults from './components/assessment/AssessmentResults';
import Registration from './components/auth/Registration';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import DocumentHub from './components/documents/DocumentHub';
import CaseStatus from './components/cases/CaseStatus';
import PaymentCenter from './components/payment/PaymentCenter';
import ConsultationScheduler from './components/consultation/ConsultationScheduler';
import NoticesViewer from './components/notices/NoticesViewer';
import ProgramSelection from './components/programs/ProgramSelection';
import InstallmentAgreement from './components/programs/InstallmentAgreement';
import OfferInCompromise from './components/programs/OfferInCompromise';
import CurrentlyNotCollectible from './components/programs/CurrentlyNotCollectible';
import PenaltyAbatement from './components/programs/PenaltyAbatement';
import InnocentSpouseRelief from './components/programs/InnocentSpouseRelief';
import MockModeToggle from './components/common/MockModeToggle';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import CaseManagement from './components/admin/CaseManagement';
import DocumentManagement from './components/admin/DocumentManagement';
import Communications from './components/admin/Communications';

const AppContent: React.FC = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const { isTransitioning, endTransition } = usePageTransition();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/assessment" element={<Onboarding />} />
        <Route path="/assessment-v2" element={<EnhancedAssessment />} />
        <Route path="/assessment-results" element={<AssessmentResults />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portal" element={<ClientPortal />} />
        <Route path="/documents" element={<DocumentHub />} />
        <Route path="/status" element={<CaseStatus />} />
        <Route path="/payment" element={<PaymentCenter />} />
        <Route path="/consultation" element={<ConsultationScheduler />} />
        <Route path="/notices" element={<NoticesViewer />} />
        <Route path="/programs" element={<ProgramSelection />} />
        <Route path="/program/installment-agreement" element={<InstallmentAgreement />} />
        <Route path="/program/offer-in-compromise" element={<OfferInCompromise />} />
        <Route path="/program/currently-not-collectible" element={<CurrentlyNotCollectible />} />
        <Route path="/program/penalty-abatement" element={<PenaltyAbatement />} />
        <Route path="/program/innocent-spouse" element={<InnocentSpouseRelief />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/cases" element={<CaseManagement />} />
        <Route path="/admin/documents" element={<DocumentManagement />} />
        <Route path="/admin/communications" element={<Communications />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isDevelopment && <MockModeToggle />}
      <LoadingTransition 
        isLoading={isTransitioning} 
        onLoadingComplete={endTransition}
      />
    </>
  );
};

function App() {
  return (
    <Router>
      <PageTransitionProvider>
        <OnboardingProvider>
          <AppContent />
        </OnboardingProvider>
      </PageTransitionProvider>
    </Router>
  );
}

export default App;