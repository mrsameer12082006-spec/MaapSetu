import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';

// ComplexLaw Homepage
import { ComplexLawHomePage } from './pages/ComplexLawHomePage';

// Public Pages
import { LoginPage } from './pages/public/LoginPage';
import { VerifyCertificatePage } from './pages/public/VerifyCertificatePage';

// Business Owner Pages
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { RegisterInstrumentPage } from './pages/business/RegisterInstrumentPage';
import { SubmitApplicationPage } from './pages/business/SubmitApplicationPage';
import { MyApplicationsPage } from './pages/business/MyApplicationsPage';
import { MyCertificatesPage } from './pages/business/MyCertificatesPage';

// LMD Administrative Pages
import { LmdDashboard } from './pages/lmd/LmdDashboard';
import { ReviewApplicationsPage } from './pages/lmd/ReviewApplicationsPage';
import { AssignOfficerPage } from './pages/lmd/AssignOfficerPage';
import { AllApplicationsPage } from './pages/lmd/AllApplicationsPage';

// LMO / GATC Verification Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { AssignedQueuePage } from './pages/officer/AssignedQueuePage';
import { VerificationFormPage } from './pages/officer/VerificationFormPage';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Main Landing Page */}
            <Route path="/" element={<ComplexLawHomePage />} />
            <Route path="/complexlaw" element={<ComplexLawHomePage />} />
            <Route path="/verify" element={<VerifyCertificatePage />} />
            <Route path="/verify/:certId" element={<VerifyCertificatePage />} />

            {/* Portal Layout Routes */}
            <Route element={<AppLayout />}>
              <Route path="login" element={<LoginPage />} />

              {/* Business Owner Portal Routes */}
              <Route path="business" element={<BusinessDashboard />} />
              <Route path="business/dashboard" element={<BusinessDashboard />} />
              <Route path="business/register" element={<RegisterInstrumentPage />} />
              <Route path="business/apply" element={<SubmitApplicationPage />} />
              <Route path="business/applications" element={<MyApplicationsPage />} />
              <Route path="business/certificates" element={<MyCertificatesPage />} />

              {/* LMD Administrator Portal Routes */}
              <Route path="lmd" element={<LmdDashboard />} />
              <Route path="lmd/dashboard" element={<LmdDashboard />} />
              <Route path="lmd/review" element={<ReviewApplicationsPage />} />
              <Route path="lmd/assign" element={<AssignOfficerPage />} />
              <Route path="lmd/all" element={<AllApplicationsPage />} />
              <Route path="lmd/applications" element={<AllApplicationsPage />} />

              {/* LMO / GATC Verification Officer Portal Routes */}
              <Route path="officer" element={<OfficerDashboard />} />
              <Route path="officer/dashboard" element={<OfficerDashboard />} />
              <Route path="officer/queue" element={<AssignedQueuePage />} />
              <Route path="officer/verify" element={<VerificationFormPage />} />
              <Route path="officer/verify/new" element={<VerificationFormPage />} />
              <Route path="lmo" element={<OfficerDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
