import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Building2, UserCheck, ShieldCheck, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { useAuth, USER_ROLES } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

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
    <div className="max-w-md mx-auto py-12">
      <Card className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary-light text-primary mx-auto flex items-center justify-center border border-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">MaapSetu Portal Access</h2>
          <p className="text-xs text-neutral-600">
            Select your user role to enter the Legal Metrology Verification System.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Select User Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect(USER_ROLES.BUSINESS)}
              className={`p-3 rounded-button border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedRole === USER_ROLES.BUSINESS
                  ? 'border-primary bg-primary-light/60 text-primary font-semibold ring-2 ring-primary/20'
                  : 'border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs">Business</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect(USER_ROLES.LMD_ADMIN)}
              className={`p-3 rounded-button border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedRole === USER_ROLES.LMD_ADMIN
                  ? 'border-primary bg-primary-light/60 text-primary font-semibold ring-2 ring-primary/20'
                  : 'border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs">LMD Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect(USER_ROLES.OFFICER)}
              className={`p-3 rounded-button border text-center transition-all flex flex-col items-center gap-1.5 ${
                selectedRole === USER_ROLES.OFFICER
                  ? 'border-primary bg-primary-light/60 text-primary font-semibold ring-2 ring-primary/20'
                  : 'border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="text-xs">LMO / GATC</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Government Email / User ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="p-3 bg-neutral-100 rounded-md border border-neutral-300 text-xs text-neutral-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Mock Login Active: No real credentials required for hackathon testing.</span>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full" icon={ArrowRight}>
            Sign In to {selectedRole === USER_ROLES.BUSINESS ? 'Business Portal' : selectedRole === USER_ROLES.LMD_ADMIN ? 'LMD Dashboard' : 'Officer Queue'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
