import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';

// ComplexLaw Homepage
import { ComplexLawHomePage } from './pages/ComplexLawHomePage';

// Public Login & Sign Up Page
import { LoginPage } from './pages/public/LoginPage';

// Business Owner Dashboard Page
import { BusinessDashboard } from './pages/business/BusinessDashboard';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Main Landing Page */}
            <Route path="/" element={<ComplexLawHomePage />} />
            <Route path="/complexlaw" element={<ComplexLawHomePage />} />

            {/* Portal Layout Routes */}
            <Route element={<AppLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="business" element={<BusinessDashboard />} />
              <Route path="business/dashboard" element={<BusinessDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
