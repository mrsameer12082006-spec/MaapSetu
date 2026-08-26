import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Building2,
  Users,
  Search,
  CheckSquare,
  FileText,
  Sparkles,
  Calendar,
  MapPin,
  Eye,
  Check,
  X,
  Award
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const LmdDashboard = () => {
  const { user } = useAuth();
  const { applications, officers, certificates, assignOfficer, submitVerificationResult } = useData();

  // State for Review & Assignment Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [verifierType, setVerifierType] = useState('LMO'); // 'LMO' or 'GATC'
  const [selectedOfficerId, setSelectedOfficerId] = useState('OFF-101');
  const [scheduledDate, setScheduledDate] = useState('2026-08-30');
  const [assignmentNotes, setAssignmentNotes] = useState('Inspect heavy standard test weights on site.');
  const [assignLoading, setAssignLoading] = useState(false);

  // State for Final Approval Modal
  const [reviewRecordApp, setReviewRecordApp] = useState(null);

  // Compute Metrics Bar Counts as requested
  const metrics = {
    newApps: 12,
    underReview: 7,
    awaitingAssignment: 4,
    scheduled: 9,
    verification: 6,
    completed: 84
  };

  // Automated Eligibility Route Rule Helper
  const getEligibleRoute = (instrumentName = '') => {
    const lower = instrumentName.toLowerCase();
    if (lower.includes('water') || lower.includes('flowmeter') || lower.includes('packaged')) {
      return { route: 'GATC', label: 'GATC Authorized Test Centre', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
    return { route: 'LMO', label: 'State LMO Inspectorate', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  // Handle Assigning Verifier
  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setAssignLoading(true);

    await assignOfficer(
      selectedApp.id,
      selectedOfficerId,
      scheduledDate,
      `[${verifierType} Route] ${assignmentNotes}`
    );

    setAssignLoading(false);
    setSelectedApp(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-7 pb-20 text-[#003943]">
      {/* 1. HEADER BANNER */}
      <div className="space-y-1.5 pt-2">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00959C]">
          LMD ADMINISTRATOR PORTAL
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#003943] tracking-tight">
          Statewide Control & Verification Roster
        </h1>
        <p className="text-xs sm:text-sm text-[#003943]/70 font-medium max-w-3xl">
          Supervise incoming business applications, review eligibility routes, assign LMO/GATC verifiers, and approve inspection records.
        </p>
      </div>

      {/* 2. MAIN METRICS BAR (EXACT NUMBERS REQUESTED) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#003943]">{metrics.newApps}</p>
          <p className="text-[11px] font-bold text-[#003943]/70 uppercase tracking-wider">New</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-700">{metrics.underReview}</p>
          <p className="text-[11px] font-bold text-[#003943]/70 uppercase tracking-wider">Under Review</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-[#00959C]">{metrics.awaitingAssignment}</p>
          <p className="text-[11px] font-bold text-[#003943]/70 uppercase tracking-wider">Awaiting Assign</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-purple-700">{metrics.scheduled}</p>
          <p className="text-[11px] font-bold text-[#003943]/70 uppercase tracking-wider">Scheduled</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-cyan-700">{metrics.verification}</p>
          <p className="text-[11px] font-bold text-[#003943]/70 uppercase tracking-wider">Verification</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#003943]/15 shadow-xs text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">{metrics.completed}</p>
          <p className="text-[11px] font-bold text-[#003943]/70 uppercase tracking-wider">Completed</p>
        </div>
      </div>

      {/* 3. CASE WORKFLOW PIPELINE: INCOMING APPLICATIONS QUEUE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#003943]/15 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#003943]/10">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#003943]">
              Incoming Business Cases & Route Engine
            </h2>
            <p className="text-xs text-[#003943]/70">
              Review application completeness, check eligibility rules, and assign authorized verifier (LMO / GATC).
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#E0F5F6] text-[#00959C] text-xs font-bold shrink-0">
            {applications.length} Active Cases
          </span>
        </div>

        <div className="space-y-4">
          {applications.map((app) => {
            const eligibility = getEligibleRoute(app.instrumentName);
            const isAssigned = app.status === 'assigned' || app.status === 'in_progress';
            const isCompleted = app.status === 'passed' || app.status === 'failed';

            return (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-[#FDF9F6] border border-[#003943]/15 hover:border-[#00959C] transition-all space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-[#00959C]">{app.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${eligibility.color}`}>
                        Route Rule: {eligibility.label}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#003943]/10 text-[#003943] text-[10px] font-bold uppercase">
                        {app.applicationType}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#003943]">
                      {app.instrumentName}
                    </h3>

                    <p className="text-xs text-[#003943]/80">
                      Applicant: <span className="font-semibold text-[#003943]">{app.applicantName}</span> • Submitted: {app.submissionDate}
                    </p>

                    <p className="text-xs text-[#003943]/70 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00959C]" /> Location: {app.inspectionLocation}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    {isAssigned ? (
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold">
                          Assigned to {app.assignedOfficerName || 'Officer'}
                        </span>
                        <p className="text-[11px] text-[#003943]/60 mt-0.5">Date: {app.scheduledInspectionDate || 'Scheduled'}</p>
                      </div>
                    ) : isCompleted ? (
                      <button
                        type="button"
                        onClick={() => setReviewRecordApp(app)}
                        className="px-4 py-2 rounded-full bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
                      >
                        <Award className="w-4 h-4 text-emerald-300" />
                        <span>View Approved Record</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="px-5 py-2.5 rounded-full bg-[#003943] hover:bg-[#002B33] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4 text-[#02B7BF]" />
                        <span>Review & Assign Verifier</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. VERIFIER ROSTER & AUTHORIZED CENTRES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#003943]/15 shadow-md space-y-6">
        <div className="pb-3 border-b border-[#003943]/10">
          <h3 className="font-serif font-bold text-xl text-[#003943]">
            Authorized Verifiers Roster (LMO Inspectors & GATCs)
          </h3>
          <p className="text-xs text-[#003943]/70">
            State Government Inspectors & Approved Testing Centres available for field verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {officers.map((off) => (
            <div key={off.id} className="p-4 rounded-2xl border border-[#003943]/15 bg-[#FDF9F6] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={off.avatar} alt={off.name} className="w-8 h-8 rounded-full object-cover border border-[#00959C]" />
                  <div>
                    <h4 className="font-bold text-xs text-[#003943]">{off.name}</h4>
                    <span className="text-[10px] text-[#00959C] font-semibold">{off.role}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">★ {off.rating}</span>
              </div>
              <p className="text-[11px] text-[#003943]/70">Zone: {off.zone}</p>
              <p className="text-[11px] font-bold text-[#003943]">Active Load: {off.activeCount} verifications</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. REVIEW & ASSIGN VERIFIER MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-[#003943]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-[#003943]/20 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#003943]/10">
              <div>
                <span className="text-[10px] font-extrabold text-[#00959C] uppercase tracking-wider">
                  CASE ASSIGNMENT WORKFLOW
                </span>
                <h3 className="font-serif font-bold text-xl text-[#003943]">
                  Review & Assign Verifier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-[#003943] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Case Details Box */}
            <div className="p-4 bg-[#FDF9F6] rounded-2xl border border-[#003943]/10 text-xs space-y-1.5">
              <p className="font-mono font-bold text-[#00959C]">{selectedApp.id}</p>
              <p className="font-serif font-bold text-[#003943] text-sm">{selectedApp.instrumentName}</p>
              <p className="text-[#003943]/70">Applicant: {selectedApp.applicantName}</p>
              <p className="text-[#003943]/70">Location: {selectedApp.inspectionLocation}</p>
            </div>

            {/* Verifier Route Eligibility Selection */}
            <form onSubmit={handleConfirmAssignment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                  Select Verifier Entity Route <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVerifierType('LMO')}
                    className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      verifierType === 'LMO'
                        ? 'border-[#00959C] bg-[#003943] text-white shadow-xs'
                        : 'border-[#003943]/20 bg-[#FDF9F6] text-[#003943]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>LMO Govt Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifierType('GATC')}
                    className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      verifierType === 'GATC'
                        ? 'border-[#00959C] bg-[#003943] text-white shadow-xs'
                        : 'border-[#003943]/20 bg-[#FDF9F6] text-[#003943]'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>GATC Approved Centre</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                  Select Authorized Inspector / Centre <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  required
                  className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943]"
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.role} — {off.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                  Scheduled Inspection Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                  Inspection Instructions / Notes
                </label>
                <textarea
                  rows={2}
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl p-3 text-xs font-semibold text-[#003943]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 text-[#003943] font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={assignLoading}
                  className="px-6 py-3 rounded-full bg-[#003943] hover:bg-[#002B33] text-white font-extrabold text-xs transition-all shadow-md"
                >
                  {assignLoading ? 'Assigning...' : 'Assign Verifier & Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
