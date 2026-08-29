import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const USER_ROLES = {
  BUSINESS: 'business',
  LMD_ADMIN: 'lmd',
  OFFICER: 'officer'
};

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(null);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch full profile from DB
  const loadUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return profile;
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
      return null;
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const profile = await loadUserProfile(session.user.id);
        if (profile) {
          setUser({ ...session.user, ...profile });
          setCurrentRole(profile.role);
          localStorage.setItem('maapsetu_role', profile.role);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const profile = await loadUserProfile(session.user.id);
        if (profile) {
          setUser({ ...session.user, ...profile });
          setCurrentRole(profile.role);
          localStorage.setItem('maapsetu_role', profile.role);
        }
      } else {
        setUser(null);
        setCurrentRole(null);
        localStorage.removeItem('maapsetu_role');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginAsRole = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const registerUser = async (email, password, profileData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData // Stored in raw_user_meta_data if needed, but we rely on a trigger or manual insert
      }
    });
    if (error) throw error;

    if (data?.user) {
      // Insert profile immediately after successful signup
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: email,
          name: profileData.name,
          phone: profileData.phone,
          role: profileData.role,
          organization: profileData.organization,
          is_active: true
        }
      ]);
      if (profileError) {
        console.error('Profile creation failed:', profileError);
        throw profileError;
      }
    }
    
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setCurrentRole(null);
    localStorage.removeItem('maapsetu_role');
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        user,
        session,
        loading,
        loginAsRole,
        registerUser,
        logout,
        USER_ROLES
      }}
    >
      {!loading && children}
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
