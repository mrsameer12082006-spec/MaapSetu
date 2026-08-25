import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, LogOut, ChevronDown, Check, Sparkles, Search } from 'lucide-react';
import { useAuth, USER_ROLES } from '../../context/AuthContext';

export const Navbar = () => {
  const { currentRole, user, loginAsRole, logout } = useAuth();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [quickCertId, setQuickCertId] = useState('');

  const handleRoleChange = (roleKey) => {
    loginAsRole(roleKey);
    setRoleMenuOpen(false);
    if (roleKey === USER_ROLES.BUSINESS) navigate('/business');
    else if (roleKey === USER_ROLES.LMD_ADMIN) navigate('/lmd');
    else if (roleKey === USER_ROLES.OFFICER) navigate('/officer');
  };

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (quickCertId.trim()) {
      navigate(`/verify/${quickCertId.trim().toUpperCase()}`);
      setQuickCertId('');
    }
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-40 shadow-sm border-b border-primary-dark">
      {/* Top micro banner */}
      <div className="bg-primary-dark text-xs py-1 px-4 text-primary-light flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Government of India</span>
          <span className="opacity-40">|</span>
          <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span>Legal Metrology Division (SIH 26036)</span>
          <span className="opacity-40">|</span>
          <span className="text-emerald-300 font-medium">System Status: Online</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white leading-none">MaapSetu</span>
              <span className="text-[10px] bg-accent/20 border border-accent/40 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                SIH 26036
              </span>
            </div>
            <p className="text-[11px] text-primary-light/80 leading-none mt-1">
              Legal Metrology Verification & Certification Platform
            </p>
          </div>
        </Link>

        {/* Quick QR Certificate Search in Nav */}
        <form onSubmit={handleQuickVerify} className="hidden md:flex items-center relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Verify Cert ID (e.g. CERT-2026-8891)..."
            value={quickCertId}
            onChange={(e) => setQuickCertId(e.target.value)}
            className="w-full bg-primary-dark/60 text-xs text-white placeholder-primary-light/60 border border-white/20 rounded-full pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <button type="submit" className="absolute right-2 text-primary-light hover:text-white">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* User Role Switcher & Auth Dropdown */}
        <div className="flex items-center gap-3">
          {/* Hackathon Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-colors"
              title="Switch User Role (Demo Tool)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <div className="text-left hidden xs:block">
                <span className="text-[10px] text-primary-light block leading-none">Active Role</span>
                <span className="font-semibold capitalize leading-none block mt-0.5">
                  {user ? user.roleTitle : 'Select Role'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-primary-light ml-1" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-card shadow-xl border border-neutral-300 text-neutral-900 py-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-neutral-300 bg-neutral-100">
                  <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Demo Role Switcher
                  </p>
                  <p className="text-[11px] text-neutral-600">Switch context instantly to test workflows</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleRoleChange(USER_ROLES.BUSINESS)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 ${
                      currentRole === USER_ROLES.BUSINESS ? 'font-bold text-primary bg-primary-light/50' : ''
                    }`}
                  >
                    <div>
                      <p className="font-semibold">Business / Owner</p>
                      <p className="text-[10px] text-neutral-600">Register scales & submit verification</p>
                    </div>
                    {currentRole === USER_ROLES.BUSINESS && <Check className="w-4 h-4 text-primary" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange(USER_ROLES.LMD_ADMIN)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 ${
                      currentRole === USER_ROLES.LMD_ADMIN ? 'font-bold text-primary bg-primary-light/50' : ''
                    }`}
                  >
                    <div>
                      <p className="font-semibold">LMD Administrator</p>
                      <p className="text-[10px] text-neutral-600">Review requests & assign officers</p>
                    </div>
                    {currentRole === USER_ROLES.LMD_ADMIN && <Check className="w-4 h-4 text-primary" />}
                  </button>

                  <button
                    onClick={() => handleRoleChange(USER_ROLES.OFFICER)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 ${
                      currentRole === USER_ROLES.OFFICER ? 'font-bold text-primary bg-primary-light/50' : ''
                    }`}
                  >
                    <div>
                      <p className="font-semibold">LMO / GATC Officer</p>
                      <p className="text-[10px] text-neutral-600">Record observations & issue PASS/FAIL</p>
                    </div>
                    {currentRole === USER_ROLES.OFFICER && <Check className="w-4 h-4 text-primary" />}
                  </button>
                </div>
                <div className="border-t border-neutral-300 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setRoleMenuOpen(false)}
                    className="block px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  >
                    Open Login / Role Selector Screen
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Logout */}
          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-white/30 object-cover"
              />
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-primary-light hover:text-white hover:bg-white/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-button bg-accent text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Portal Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
