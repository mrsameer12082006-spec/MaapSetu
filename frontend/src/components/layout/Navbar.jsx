import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-[#FDF9F6]/95 backdrop-blur-md text-[#003943] sticky top-0 z-50 border-b border-[#003943]/10 shadow-sm">
      {/* Main Bar */}
      <div className="w-full px-6 sm:px-12 lg:px-20 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#003943] text-[#02B7BF] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Scale className="w-6 h-6 text-[#02B7BF]" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#003943] font-serif">Maap</span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#00959C] font-serif italic">Setu</span>
          </div>
        </Link>

        {/* Right Side Action Button: Fitted Solid Button */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#003943] hover:bg-[#002B33] text-white border border-[#00959C]/40 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 group"
          >
            <ArrowLeft className="w-4 h-4 text-[#02B7BF] group-hover:-translate-x-1 transition-transform" />
            <span>Return to MaapSetu Homepage</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
