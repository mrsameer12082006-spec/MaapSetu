import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 text-xs py-8 border-t border-neutral-800 no-print mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6 border-b border-neutral-800">
          <div>
            <h4 className="text-white font-bold text-sm mb-2">MaapSetu Platform</h4>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Official online verification and certification portal for weighing and measuring instruments under the Legal Metrology Act, 2009.
            </p>
            <p className="text-[11px] text-emerald-400 mt-2 font-mono">SIH Problem Statement 26036</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Quick Navigation</h4>
            <ul className="space-y-1 text-neutral-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home & Overview</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
              <li><Link to="/verify/CERT-2026-8891" className="hover:text-white transition-colors">Public QR Verification</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Legal Metrology Acts</h4>
            <ul className="space-y-1 text-neutral-400">
              <li>Legal Metrology Act, 2009</li>
              <li>Legal Metrology (General) Rules, 2011</li>
              <li>Legal Metrology (Approval of Models) Rules</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Department Contact</h4>
            <p className="text-neutral-400">Department of Consumer Affairs</p>
            <p className="text-neutral-400">Ministry of Consumer Affairs, Food & Public Distribution</p>
            <p className="text-neutral-400 mt-2">Krishi Bhawan, New Delhi - 110001</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-neutral-500 gap-2">
          <p>© {new Date().getFullYear()} Legal Metrology Division, Govt of India. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
