import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const USER_ROLES = {
  BUSINESS: 'business',
  LMD_ADMIN: 'lmd',
  OFFICER: 'officer'
};

const MOCK_USERS = {
  [USER_ROLES.BUSINESS]: {
    id: 'USR-BIZ-01',
    name: 'Vikramaditya Mehta',
    organization: 'Apex Logistics & Freight Corp',
    role: USER_ROLES.BUSINESS,
    roleTitle: 'Business / Instrument Owner',
    email: 'v.mehta@apexlogistics.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    jurisdiction: 'Maharashtra & All India Ports'
  },
  [USER_ROLES.LMD_ADMIN]: {
    id: 'USR-LMD-01',
    name: 'Sunita Prabhakar (IAS)',
    organization: 'Legal Metrology Department, Govt of Maharashtra',
    role: USER_ROLES.LMD_ADMIN,
    roleTitle: 'LMD Administrator',
    email: 'controller.lmd@maharashtra.gov.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    jurisdiction: 'State Controller Division'
  },
  [USER_ROLES.OFFICER]: {
    id: 'OFF-101',
    name: 'Inspector Rajesh V. Sharma',
    organization: 'Legal Metrology Inspectorate (Nagpur Zone)',
    role: USER_ROLES.OFFICER,
    roleTitle: 'LMO / GATC Verification Officer',
    email: 'r.sharma@lmd.gov.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    jurisdiction: 'Nagpur Industrial Division'
  }
};

export const AuthProvider = ({ children }) => {
  // Default to Business for immediate inspection, or null if unauthenticated
  const [currentRole, setCurrentRole] = useState(USER_ROLES.BUSINESS);
  const [user, setUser] = useState(MOCK_USERS[USER_ROLES.BUSINESS]);

  const loginAsRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      setCurrentRole(roleKey);
      setUser(MOCK_USERS[roleKey]);
    }
  };

  const logout = () => {
    setCurrentRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        user,
        loginAsRole,
        logout,
        USER_ROLES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
