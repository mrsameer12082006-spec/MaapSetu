import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Clock,
  UserCheck,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BusinessDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mode state: Default to EMPTY SECTIONS as requested by user
  const [showSampleData, setShowSampleData] = useState(false);

  const userName = user?.name ? user.name.split(' ')[0] : 'Vikramaditya';

  return (
    <div className="w-full space-y-7 selection:bg-[#02B7BF] selection:text-white pb-16">
      {/* 1. WELCOME HEADER */}
      <div className="space-y-1.5 pt-2">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00959C]">
          BUSINESS OWNER
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#003943] tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-xs sm:text-sm text-[#003943]/70 font-medium">
          Here's what needs your attention.
        </p>
      </div>

      {/* 2. PRIMARY CTA BANNER */}
      <div
        onClick={() => navigate('/business/register')}
        className="w-full bg-[#003943] hover:bg-[#002B33] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#00959C]/30 flex items-center justify-between cursor-pointer transition-all duration-200 group"
      >
        <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
          Register a new instrument
        </h3>
        <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1.5 transition-transform shrink-0 ml-4" />
      </div>

      {/* 3. THREE SUMMARY STAT CARDS */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Certified */}
        <div className="bg-white rounded-2xl p-5 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-serif font-bold text-[#003943]">
            {showSampleData ? 5 : 0}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-[#003943]/70">
            Certified
          </p>
        </div>

        {/* Card 2: Expiring soon */}
        <div className="bg-white rounded-2xl p-5 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-serif font-bold text-[#003943]">
            {showSampleData ? 2 : 0}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-[#003943]/70">
            Expiring soon
          </p>
        </div>

        {/* Card 3: In progress */}
        <div className="bg-white rounded-2xl p-5 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-serif font-bold text-[#003943]">
            {showSampleData ? 4 : 0}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-[#003943]/70">
            In progress
          </p>
        </div>
      </div>

      {/* 4. CERTIFIED INSTRUMENTS SECTION */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#003943]">
            Certified instruments
          </h2>
          <button
            type="button"
            className="text-xs font-bold text-[#00959C] hover:underline"
          >
            View all
          </button>
        </div>

        {!showSampleData ? (
          /* EMPTY STATE CARD */
          <div className="bg-white rounded-2xl p-8 border border-[#003943]/15 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#E0F5F6] text-[#00959C] flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-serif font-bold text-[#003943] text-base">No certified instruments yet</p>
            <p className="text-xs text-[#003943]/60 max-w-sm mx-auto">
              Instruments verified and stamped by Legal Metrology Officers will appear here.
            </p>
          </div>
        ) : (
          /* SAMPLE POPULATED ITEMS */
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Retail Counter Scale</h4>
                  <p className="text-xs text-[#003943]/60 font-mono">RC-002391-IN · Valid until 2027-01-19</p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-[#003943] text-white font-bold text-xs hover:bg-[#002B33] transition-colors shrink-0"
              >
                View certificate
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Digital Platform Scale</h4>
                  <p className="text-xs text-[#003943]/60 font-mono">DP-556012-IN · Valid until 2027-03-02</p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-[#003943] text-white font-bold text-xs hover:bg-[#002B33] transition-colors shrink-0"
              >
                View certificate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. EXPIRING SOON SECTION */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#003943]">
            Expiring soon
          </h2>
          <button
            type="button"
            className="text-xs font-bold text-[#00959C] hover:underline"
          >
            View all
          </button>
        </div>

        {!showSampleData ? (
          /* EMPTY STATE CARD */
          <div className="bg-white rounded-2xl p-8 border border-[#003943]/15 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="font-serif font-bold text-[#003943] text-base">No instruments expiring soon</p>
            <p className="text-xs text-[#003943]/60 max-w-sm mx-auto">
              You will receive automatic alerts 30 days prior to annual re-verification deadlines.
            </p>
          </div>
        ) : (
          /* SAMPLE POPULATED ITEMS */
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Diesel Dispensing Pump #2</h4>
                  <p className="text-xs text-red-600 font-semibold">Expires in 19 days · 2026-09-14</p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-[#A82B2B] text-white font-bold text-xs hover:bg-[#8A2323] transition-colors shrink-0"
              >
                Start re-verification
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Warehouse Platform Scale</h4>
                  <p className="text-xs text-amber-800 font-semibold">Expires in 45 days · 2026-10-10</p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-[#965A0D] text-white font-bold text-xs hover:bg-[#78470A] transition-colors shrink-0"
              >
                Start re-verification
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. YOUR APPLICATIONS SECTION */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#003943]">
            Your applications
          </h2>
          <button
            type="button"
            className="text-xs font-bold text-[#00959C] hover:underline"
          >
            See all
          </button>
        </div>

        {!showSampleData ? (
          /* EMPTY STATE CARD */
          <div className="bg-white rounded-2xl p-8 border border-[#003943]/15 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#E0F5F6] text-[#00959C] flex items-center justify-center mx-auto mb-1">
              <FileText className="w-6 h-6" />
            </div>
            <p className="font-serif font-bold text-[#003943] text-base">No active applications</p>
            <p className="text-xs text-[#003943]/60 max-w-sm mx-auto">
              When you submit a new verification application, its status will be tracked here.
            </p>
          </div>
        ) : (
          /* SAMPLE POPULATED ITEMS */
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Retail Counter Scale #2</h4>
                  <p className="text-xs text-[#003943]/60">Just submitted</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold shrink-0">
                Submitted
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Tank Measure — Depot 5</h4>
                  <p className="text-xs text-[#003943]/60">Form incomplete</p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-[#003943] text-white font-bold text-xs hover:bg-[#002B33] transition-colors shrink-0"
              >
                Continue — Pending
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. UNDER REVIEW / ASSIGNED SECTION */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#003943]">
            Under review / Assigned
          </h2>
          <button
            type="button"
            className="text-xs font-bold text-[#00959C] hover:underline"
          >
            See all
          </button>
        </div>

        {!showSampleData ? (
          /* EMPTY STATE CARD */
          <div className="bg-white rounded-2xl p-8 border border-[#003943]/15 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#E0F5F6] text-[#00959C] flex items-center justify-center mx-auto mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="font-serif font-bold text-[#003943] text-base">No items under review or assigned</p>
            <p className="text-xs text-[#003943]/60 max-w-sm mx-auto">
              Applications under LMD administration review or assigned to an officer will be listed here.
            </p>
          </div>
        ) : (
          /* SAMPLE POPULATED ITEMS */
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Platform Scale — Warehouse 3</h4>
                  <p className="text-xs text-[#003943]/60">With LMD Maharashtra</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold shrink-0">
                Under review
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Heavy Electronic Weighbridge</h4>
                  <p className="text-xs text-[#003943]/60">Assigned to R. Sharma</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold shrink-0">
                Assigned
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Tank Measure — Depot 4</h4>
                  <p className="text-xs text-[#003943]/60">Visit scheduled for Friday</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold shrink-0">
                Scheduled
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#003943]/15 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003943] text-sm sm:text-base">Flowmeter — Petrol Pump 9</h4>
                  <p className="text-xs text-[#003943]/60">Officer on site today</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold shrink-0">
                Verification
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
