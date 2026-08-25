import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Scale, Building2, UserCheck, ShieldCheck, ArrowRight, Lock, Sparkles, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useAuth, USER_ROLES } from '../../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || USER_ROLES.BUSINESS;

  const { loginAsRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [username, setUsername] = useState('v.mehta@apexlogistics.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      loginAsRole(selectedRole);
      setLoading(false);

      if (selectedRole === USER_ROLES.BUSINESS) navigate('/business');
      else if (selectedRole === USER_ROLES.LMD_ADMIN) navigate('/lmd');
      else if (selectedRole === USER_ROLES.OFFICER) navigate('/officer');
    }, 400);
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    if (roleKey === USER_ROLES.BUSINESS) setUsername('v.mehta@apexlogistics.in');
    else if (roleKey === USER_ROLES.LMD_ADMIN) setUsername('controller.lmd@maharashtra.gov.in');
    else if (roleKey === USER_ROLES.OFFICER) setUsername('r.sharma@lmd.gov.in');
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#FDF9F6] text-[#003943] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#003943]/15 space-y-8 relative overflow-hidden">
        {/* Top Decorative Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#003943] via-[#00959C] to-[#02B7BF]" />

        {/* Card Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-[#003943] text-[#02B7BF] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Scale className="w-8 h-8 text-[#02B7BF]" />
            </div>
            <div className="flex items-baseline text-left">
              <span className="text-3xl font-extrabold tracking-tight text-[#003943] font-serif">Maap</span>
              <span className="text-3xl font-extrabold tracking-tight text-[#00959C] font-serif italic">Setu</span>
            </div>
          </Link>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#003943] tracking-tight pt-2">
            Portal Access
          </h2>
          <p className="text-xs sm:text-sm text-[#003943]/70 max-w-sm mx-auto">
            Select your user role to enter the Legal Metrology Verification System.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/70">
            Select User Role
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleRoleSelect(USER_ROLES.BUSINESS)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                selectedRole === USER_ROLES.BUSINESS
                  ? 'border-[#00959C] bg-[#003943] text-white font-bold shadow-md ring-2 ring-[#00959C]/30'
                  : 'border-[#003943]/15 bg-[#FDF9F6] text-[#003943] hover:border-[#00959C] hover:bg-white'
              }`}
            >
              <Building2 className={`w-6 h-6 ${selectedRole === USER_ROLES.BUSINESS ? 'text-[#02B7BF]' : 'text-[#00959C]'}`} />
              <span className="text-xs sm:text-sm">Business</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect(USER_ROLES.LMD_ADMIN)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                selectedRole === USER_ROLES.LMD_ADMIN
                  ? 'border-[#00959C] bg-[#003943] text-white font-bold shadow-md ring-2 ring-[#00959C]/30'
                  : 'border-[#003943]/15 bg-[#FDF9F6] text-[#003943] hover:border-[#00959C] hover:bg-white'
              }`}
            >
              <ShieldCheck className={`w-6 h-6 ${selectedRole === USER_ROLES.LMD_ADMIN ? 'text-[#02B7BF]' : 'text-[#00959C]'}`} />
              <span className="text-xs sm:text-sm">LMD Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect(USER_ROLES.OFFICER)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                selectedRole === USER_ROLES.OFFICER
                  ? 'border-[#00959C] bg-[#003943] text-white font-bold shadow-md ring-2 ring-[#00959C]/30'
                  : 'border-[#003943]/15 bg-[#FDF9F6] text-[#003943] hover:border-[#00959C] hover:bg-white'
              }`}
            >
              <UserCheck className={`w-6 h-6 ${selectedRole === USER_ROLES.OFFICER ? 'text-[#02B7BF]' : 'text-[#00959C]'}`} />
              <span className="text-xs sm:text-sm">LMO / GATC</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
              {selectedRole === USER_ROLES.BUSINESS
                ? 'Email / Mobile Number'
                : selectedRole === USER_ROLES.LMD_ADMIN
                ? 'Government Email / Employee ID'
                : 'Official Email / Officer ID'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={
                selectedRole === USER_ROLES.BUSINESS
                  ? 'e.g. v.mehta@apexlogistics.in or +91 98765 43210'
                  : selectedRole === USER_ROLES.LMD_ADMIN
                  ? 'e.g. controller.lmd@maharashtra.gov.in or EMP-LMD-9041'
                  : 'e.g. r.sharma@lmd.gov.in or OFFICER-NGP-442'
              }
              required
              className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C] focus:ring-2 focus:ring-[#00959C]/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-sm font-mono font-bold text-[#003943] focus:outline-none focus:border-[#00959C] focus:ring-2 focus:ring-[#00959C]/20 transition-all"
            />
          </div>

          <div className="p-3.5 bg-[#E0F5F6] rounded-xl border border-[#00959C]/30 text-xs text-[#003943] flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#00959C] shrink-0" />
            <span className="font-medium">Mock Login Active: No real credentials required for hackathon testing.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#003943] hover:bg-[#002B33] text-white font-extrabold text-base sm:text-lg transition-all shadow-lg flex items-center justify-center gap-3 group"
          >
            <span>
              {loading ? 'Authenticating...' : `Sign In to ${selectedRole === USER_ROLES.BUSINESS ? 'Business Portal' : selectedRole === USER_ROLES.LMD_ADMIN ? 'LMD Dashboard' : 'Officer Queue'}`}
            </span>
            <div className="w-7 h-7 rounded-full bg-[#02B7BF] text-[#003943] flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
