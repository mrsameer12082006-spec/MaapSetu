import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Route Guard Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentRole, loading } = useAuth();
  
  if (loading) return <div className="p-8 text-center">Loading authentication...</div>;
  
  if (!currentRole) return <Navigate to="/login" replace />;
  
  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={`/${currentRole}`} replace />;
  }
  
  return children;
};

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
              <Route path="business" element={<ProtectedRoute allowedRole="business"><BusinessDashboard /></ProtectedRoute>} />
              <Route path="business/dashboard" element={<ProtectedRoute allowedRole="business"><BusinessDashboard /></ProtectedRoute>} />
              <Route path="business/register" element={<ProtectedRoute allowedRole="business"><RegisterInstrumentPage /></ProtectedRoute>} />
              <Route path="business/apply" element={<Navigate to="/business/register" replace />} />
              <Route path="business/applications" element={<ProtectedRoute allowedRole="business"><MyApplicationsPage /></ProtectedRoute>} />
              <Route path="business/certificates" element={<ProtectedRoute allowedRole="business"><MyCertificatesPage /></ProtectedRoute>} />

              {/* LMD Administrator Portal Routes */}
              <Route path="lmd" element={<ProtectedRoute allowedRole="lmd"><LmdDashboard /></ProtectedRoute>} />
              <Route path="lmd/dashboard" element={<ProtectedRoute allowedRole="lmd"><LmdDashboard /></ProtectedRoute>} />
              <Route path="lmd/review" element={<ProtectedRoute allowedRole="lmd"><ReviewApplicationsPage /></ProtectedRoute>} />
              <Route path="lmd/assign" element={<ProtectedRoute allowedRole="lmd"><AssignOfficerPage /></ProtectedRoute>} />
              <Route path="lmd/all" element={<ProtectedRoute allowedRole="lmd"><AllApplicationsPage /></ProtectedRoute>} />
              <Route path="lmd/applications" element={<ProtectedRoute allowedRole="lmd"><AllApplicationsPage /></ProtectedRoute>} />

              {/* LMO / GATC Verification Officer Portal Routes */}
              <Route path="officer" element={<ProtectedRoute allowedRole="officer"><OfficerDashboard /></ProtectedRoute>} />
              <Route path="officer/dashboard" element={<ProtectedRoute allowedRole="officer"><OfficerDashboard /></ProtectedRoute>} />
              <Route path="officer/queue" element={<ProtectedRoute allowedRole="officer"><AssignedQueuePage /></ProtectedRoute>} />
              <Route path="officer/verify" element={<ProtectedRoute allowedRole="officer"><VerificationFormPage /></ProtectedRoute>} />
              <Route path="officer/verify/new" element={<ProtectedRoute allowedRole="officer"><VerificationFormPage /></ProtectedRoute>} />
              <Route path="lmo" element={<ProtectedRoute allowedRole="officer"><OfficerDashboard /></ProtectedRoute>} />

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
