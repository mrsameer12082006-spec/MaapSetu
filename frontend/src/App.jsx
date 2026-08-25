import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';

// ComplexLaw Homepage Design Clone
import { ComplexLawHomePage } from './pages/ComplexLawHomePage';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { VerifyCertificatePage } from './pages/public/VerifyCertificatePage';

// Business Pages
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { RegisterInstrumentPage } from './pages/business/RegisterInstrumentPage';
import { SubmitApplicationPage } from './pages/business/SubmitApplicationPage';
import { MyApplicationsPage } from './pages/business/MyApplicationsPage';
import { MyCertificatesPage } from './pages/business/MyCertificatesPage';

// LMD Pages
import { LmdDashboard } from './pages/lmd/LmdDashboard';
import { ReviewApplicationsPage } from './pages/lmd/ReviewApplicationsPage';
import { AssignOfficerPage } from './pages/lmd/AssignOfficerPage';
import { AllApplicationsPage } from './pages/lmd/AllApplicationsPage';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { AssignedQueuePage } from './pages/officer/AssignedQueuePage';
import { VerificationFormPage } from './pages/officer/VerificationFormPage';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Primary Landing Page: ComplexLaw Homepage Design */}
            <Route path="/" element={<ComplexLawHomePage />} />
            <Route path="/complexlaw" element={<ComplexLawHomePage />} />

            {/* Portal Layout Routes */}
            <Route path="/maapsetu" element={<AppLayout />}>
              <Route index element={<LandingPage />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="verify/:certId?" element={<VerifyCertificatePage />} />

              {/* Business Portal */}
              <Route path="business" element={<BusinessDashboard />} />
              <Route path="business/register" element={<RegisterInstrumentPage />} />
              <Route path="business/apply" element={<SubmitApplicationPage />} />
              <Route path="business/applications" element={<MyApplicationsPage />} />
              <Route path="business/certificates" element={<MyCertificatesPage />} />

              {/* LMD Portal */}
              <Route path="lmd" element={<LmdDashboard />} />
              <Route path="lmd/review" element={<ReviewApplicationsPage />} />
              <Route path="lmd/assign" element={<AssignOfficerPage />} />
              <Route path="lmd/all" element={<AllApplicationsPage />} />

              {/* Officer Portal */}
              <Route path="officer" element={<OfficerDashboard />} />
              <Route path="officer/queue" element={<AssignedQueuePage />} />
              <Route path="officer/verify/new" element={<VerificationFormPage />} />

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
