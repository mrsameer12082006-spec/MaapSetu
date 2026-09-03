import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const USER_ROLES = {
  BUSINESS: 'business',
  LMD_ADMIN: 'lmd',
  OFFICER: 'officer'
};

// ── Spinner shown while the auth session is being resolved ───────────────────
const AuthLoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF9F6]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-[#00959C] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-semibold text-[#003943]">Loading MaapSetu...</p>
    </div>
  </div>
);

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(null);
  const [user, setUser]               = useState(null);
  const [session, setSession]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const bootstrapDone                 = useRef(false);

  // ── CORE: load (and if missing, auto-create) a user's profile ──────────────
  const loadUserProfile = async (authUser) => {
    if (!authUser?.id) return null;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!error && profile) return profile;

      // PGRST116 = row not found; auto-create from auth metadata
      if (error?.code === 'PGRST116' || !profile) {
        const meta = authUser.user_metadata || {};
        const role = meta.role || 'business';

        const profilePayload = {
          id:           authUser.id,
          email:        authUser.email?.toLowerCase().trim() ?? '',
          name:         meta.name?.trim() || authUser.email?.split('@')[0] || 'User',
          phone:        meta.phone?.trim() || null,
          role,
          organization: meta.organization?.trim() || null,
          is_active:    true,
        };

        const { data: newProfile, error: upsertError } = await supabase
          .from('profiles')
          .upsert(profilePayload, { onConflict: 'id' })
          .select()
          .single();

        if (upsertError) {
          console.warn('[Auth] Profile auto-create failed (using in-memory fallback):', upsertError);
          return profilePayload;
        }

        console.info('[Auth] Profile auto-created for:', authUser.email);
        return newProfile;
      }

      console.error('[Auth] Error fetching profile:', error);
      return null;
    } catch (err) {
      console.error('[Auth] Unexpected error loading profile:', err);
      return null;
    }
  };

  const applyProfile = (authUser, profile) => {
    if (profile) {
      setUser({ ...authUser, ...profile });
      setCurrentRole(profile.role);
      localStorage.setItem('maapsetu_role', profile.role);
    } else {
      setUser(authUser);
      setCurrentRole(null);
      localStorage.removeItem('maapsetu_role');
    }
  };

  // ── SESSION BOOTSTRAP ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // Safety net: if bootstrap takes longer than 10 s (e.g. wrong API key / network down),
    // unblock the app so the user at least sees the login page rather than a blank screen.
    const timeout = setTimeout(() => {
      if (!bootstrapDone.current && !cancelled) {
        console.warn('[Auth] Bootstrap timed out — check VITE_SUPABASE_ANON_KEY in .env.local');
        setLoading(false);
      }
    }, 10_000);

    const bootstrap = async () => {
      try {
        const { data: { session: existing } } = await supabase.auth.getSession();
        if (cancelled) return;

        setSession(existing);
        if (existing?.user) {
          const profile = await loadUserProfile(existing.user);
          if (!cancelled) applyProfile(existing.user, profile);
        }
      } catch (e) {
        console.error('[Auth] Bootstrap error:', e);
      } finally {
        bootstrapDone.current = true;
        clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (cancelled) return;

      setSession(newSession);

      if (newSession?.user) {
        const profile = await loadUserProfile(newSession.user);
        if (!cancelled) {
          applyProfile(newSession.user, profile);
          setLoading(false);
        }
      } else {
        setUser(null);
        setCurrentRole(null);
        localStorage.removeItem('maapsetu_role');
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // ── HELPERS ──────────────────────────────────────────────────────────────────
  // Classify Supabase errors into human-readable messages
  const classifyError = (error) => {
    const msg = error?.message?.toLowerCase() ?? '';
    const code = error?.code ?? '';

    if (msg.includes('invalid api key') || msg.includes('apikey') || msg.includes('jwt')) {
      return 'Supabase API key is missing or invalid. Set VITE_SUPABASE_ANON_KEY in your .env.local file (get it from Supabase Dashboard → Project Settings → API).';
    }
    if (msg.includes('invalid login credentials') || msg.includes('invalid email or password') || code === 'invalid_credentials') {
      return 'Incorrect email or password. Please try again.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Please confirm your email address before signing in. Check your inbox for a verification link.';
    }
    if (msg.includes('already registered') || msg.includes('user already exists')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (msg.includes('rate limit') || code === 'over_email_send_rate_limit') {
      return 'Too many requests. Please wait a moment and try again. (Tip: disable "Confirm email" in Supabase Dashboard → Auth → Providers → Email to avoid this during development.)';
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Network error — check your internet connection and try again.';
    }
    return error?.message || 'An unexpected error occurred. Please try again.';
  };

  // ── ACTIONS ──────────────────────────────────────────────────────────────────
  const loginAsRole = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(classifyError(error));

      setSession(data.session);
      let profile = null;
      if (data.user) {
        profile = await loadUserProfile(data.user);
        applyProfile(data.user, profile);
      }
      return { ...data, profile };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (email, password, profileData) => {
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');
    if (!email || !email.includes('@')) throw new Error('A valid email address is required.');

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name:         profileData.name?.trim() || '',
            phone:        profileData.phone?.trim() || null,
            role:         'business',
            organization: profileData.organization?.trim() || null,
          }
        }
      });

      if (error) throw new Error(classifyError(error));

      let profile = null;
      if (data?.user) {
        const profilePayload = {
          id:           data.user.id,
          email:        email.toLowerCase().trim(),
          name:         profileData.name?.trim() || '',
          phone:        profileData.phone?.trim() || null,
          role:         'business',
          organization: profileData.organization?.trim() || null,
          is_active:    true,
        };

        // Only insert if we have an immediate session (email confirmation OFF).
        // If confirmation is ON, session is null here — the profile will be
        // auto-created on first login via loadUserProfile().
        if (data.session) {
          const { data: savedProfile } = await supabase
            .from('profiles')
            .upsert(profilePayload, { onConflict: 'id' })
            .select()
            .single();

          profile = savedProfile || profilePayload;
          setSession(data.session);
          applyProfile(data.user, profile);
        } else {
          profile = profilePayload;
        }
      }

      return { ...data, profile };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentRole(null);
    setSession(null);
    localStorage.removeItem('maapsetu_role');
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  // Show a full-screen spinner during the initial session check so the rest of
  // the app (which depends on auth state) doesn't render prematurely.
  if (loading) return <AuthLoadingScreen />;

  return (
    <AuthContext.Provider value={{ currentRole, user, session, loading, loginAsRole, registerUser, logout, USER_ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
