import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileCheck, UserCheck, Eye, Check, X, MapPin, FileText, AlertCircle, Award, CheckSquare, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { DynamicTechnicalVerification } from '../../components/verification/DynamicTechnicalVerification';

export const ReviewApplicationsPage = () => {
  const navigate = useNavigate();
  const { applications, officers, assignOfficer, submitVerificationResult, generateCertificate } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [assignModalApp, setAssignModalApp] = useState(null);
  const [inspectModalApp, setInspectModalApp] = useState(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState(officers[0]?.id || 'OFF-101');
  const [scheduledDate, setScheduledDate] = useState('2026-08-30');
  const [assignLoading, setAssignLoading] = useState(false);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectionOutcome, setInspectionOutcome] = useState('PASS');
  const [failReason, setFailReason] = useState('MPE exceeded');
  const [inspectionRemarks, setInspectionRemarks] = useState('Physical field verification completed. All MPE tolerance checks within Rule 11 bounds.');

  const pendingReviewApps = applications.filter((app) =>
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.instrumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateCert = async (appId) => {
    const cert = await generateCertificate(appId);
    if (cert) {
      alert(`Legal Metrology Certificate ${cert.id} successfully generated & issued!`);
    }
  };

  const columns = [
    {
      header: 'App ID',
      key: 'id',
      render: (row) => <span className="font-mono font-bold text-primary text-xs">{row.id}</span>
    },
    {
      header: 'Applicant & Business',
      key: 'applicantName',
      render: (row) => (
        <div>
          <p className="font-semibold text-neutral-900">{row.applicantName}</p>
          <p className="text-[11px] text-neutral-600">Location: {row.inspectionLocation.split(',')[0]}</p>
        </div>
      )
    },
    {
      header: 'Instrument Specs',
      key: 'instrumentName',
      render: (row) => (
        <div>
          <p className="font-semibold text-neutral-900">{row.instrumentName}</p>
          <p className="text-[11px] text-neutral-600">{row.applicationType}</p>
        </div>
      )
    },
    {
      header: 'Submitted',
      key: 'submissionDate',
      render: (row) => <span className="text-xs text-neutral-600">{row.submissionDate}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: 'Actions',
      key: 'action',
      render: (row) => {
        const isPassed = row.status === 'passed' || row.status === 'inspection_passed';

        return (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedApp(row)}>
              Review Docs
            </Button>

            {isPassed ? (
              <Button
                variant="accent"
                size="sm"
                icon={Award}
                onClick={() => handleGenerateCert(row.id)}
              >
                Generate Certificate
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={UserCheck}
                onClick={() => {
                  setAssignModalApp(row);
                  if (row.assignedOfficerId) setSelectedOfficerId(row.assignedOfficerId);
                  if (row.scheduledInspectionDate) setScheduledDate(row.scheduledInspectionDate);
                }}
              >
                Assigned Officer
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Review Incoming Verification Applications</h1>
        <p className="text-xs text-neutral-600">
          Inspect submitted calibration certificates, model approvals, and owner credentials prior to assigning an inspector.
        </p>
      </div>

      <Card className="p-4 bg-white">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by App ID, Instrument, or Applicant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-input border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      <Table columns={columns} data={pendingReviewApps} emptyMessage="No applications pending review." />

      {/* Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Administrative Document Review: ${selectedApp.id}`}
          maxWidth="max-w-3xl"
          footer={
            <div className="flex items-center gap-3">
              <Button
                variant="danger"
                onClick={() => {
                  alert(`Application ${selectedApp.id} marked for document clarification.`);
                  setSelectedApp(null);
                }}
              >
                Request Clarification
              </Button>
              {selectedApp.status === 'passed' || selectedApp.status === 'inspection_passed' ? (
                <Button
                  variant="accent"
                  icon={Award}
                  onClick={() => {
                    handleGenerateCert(selectedApp.id);
                    setSelectedApp(null);
                  }}
                >
                  Generate Certificate
                </Button>
              ) : (
                <Button
                  variant="primary"
                  icon={UserCheck}
                  onClick={() => {
                    const targetId = selectedApp.id;
                    setSelectedApp(null);
                    navigate(`/lmd/assign?appId=${targetId}`);
                  }}
                >
                  Approve & Assign Officer →
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-center p-4 bg-neutral-100 rounded border border-neutral-300">
              <div>
                <p className="text-xs text-neutral-600">Applicant</p>
                <p className="font-bold text-neutral-900">{selectedApp.applicantName}</p>
              </div>
              <Badge status={selectedApp.status}>{selectedApp.status}</Badge>
            </div>

            {/* Full Machine Specifications & Legal Application Record */}
            <div className="p-4 bg-[#FDF9F6] rounded-2xl border border-[#003943]/15 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#003943]/10 pb-2">
                <div>
                  <span className="font-mono font-bold text-[#00959C]">{selectedApp.id}</span>
                  <h4 className="font-serif font-bold text-[#003943] text-sm mt-0.5">{selectedApp.instrumentName}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E0F5F6] text-[#003943] font-bold text-[10px] uppercase">
                  {selectedApp.applicationType}
                </span>
              </div>

              {/* 1. Technical Specifications */}
              <div className="space-y-1.5">
                <p className="font-bold uppercase text-[10px] tracking-wider text-[#00959C]">
                  1. Technical Specifications
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-[#003943]/10">
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Manufacturer</span>
                    <span className="font-semibold text-[#003943]">Avery India Ltd</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Model Designation</span>
                    <span className="font-semibold text-[#003943]">WB-60T-PRO</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Serial Number</span>
                    <span className="font-mono font-bold text-[#00959C]">AV-984210-IN</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Max Capacity</span>
                    <span className="font-semibold text-[#003943]">60,000 kg (60T)</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Min Capacity</span>
                    <span className="font-semibold text-[#003943]">200 kg</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Accuracy Class</span>
                    <span className="font-semibold text-[#003943]">Class III (Medium)</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Scale Interval (e)</span>
                    <span className="font-semibold text-[#003943]">10 kg</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Unit of Measure</span>
                    <span className="font-semibold text-[#003943]">Kilogram (kg)</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Quantity</span>
                    <span className="font-semibold text-[#003943]">1 Unit</span>
                  </div>
                </div>
              </div>

              {/* 2. Premises & Installation Location */}
              <div className="space-y-1.5">
                <p className="font-bold uppercase text-[10px] tracking-wider text-[#00959C]">
                  2. Premises & Installation Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-[#003943]/10">
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Business / Premises</span>
                    <span className="font-semibold text-[#003943]">{selectedApp.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Installation Address</span>
                    <span className="font-semibold text-[#003943]">{selectedApp.inspectionLocation}</span>
                  </div>
                </div>
              </div>

              {/* 3. Legal Approval & Verification Details */}
              <div className="space-y-1.5">
                <p className="font-bold uppercase text-[10px] tracking-wider text-[#00959C]">
                  3. Legal Approval & Certificate Details
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-[#003943]/10">
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Verification Type</span>
                    <span className="font-semibold text-[#003943]">{selectedApp.applicationType}</span>
                  </div>
                  <div>
                    <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Model Approval No</span>
                    <span className="font-mono font-bold text-[#003943]">IND/09/2021/442</span>
                  </div>
                  {selectedApp.applicationType?.toLowerCase().includes('re-verification') && (
                    <div>
                      <span className="text-[#003943]/60 text-[10px] font-bold block uppercase">Previous Cert No</span>
                      <span className="font-mono font-bold text-[#003943]">CERT-2025-8891</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase text-neutral-600 border-b pb-1 mb-2">
                Attached Documents ({selectedApp.documents.length})
              </h4>
              <div className="space-y-2">
                {selectedApp.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-neutral-300 text-xs">
                    <span className="font-medium text-neutral-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> {doc.name}
                    </span>
                    <button
                      onClick={() => alert(`Previewing ${doc.name}`)}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Preview File
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedApp.notes && (
              <div className="p-3 bg-neutral-100 rounded border border-neutral-300 text-xs">
                <p className="font-semibold text-neutral-900">Applicant Notes:</p>
                <p className="text-neutral-600 mt-0.5">{selectedApp.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Assign Officer Details Modal (On Same Page - No Redirection) */}
      {assignModalApp && (
        <Modal
          isOpen={!!assignModalApp}
          onClose={() => setAssignModalApp(null)}
          title={`Verifier Assignment: ${assignModalApp.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-5 text-[#003943]">
            {/* Header info */}
            <div className="p-3.5 bg-[#FDF9F6] rounded-2xl border border-[#003943]/15 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[#00959C]">{assignModalApp.id}</span>
                <Badge status={assignModalApp.status}>{assignModalApp.status}</Badge>
              </div>
              <p className="font-serif font-bold text-[#003943] text-sm">{assignModalApp.instrumentName}</p>
              <p className="text-[#003943]/70 font-medium">Applicant Vendor: {assignModalApp.applicantName}</p>
            </div>

            {/* Currently Assigned Officer Details (Name, Date, Rating) */}
            {assignModalApp.assignedOfficerName ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                  ASSIGNED VERIFIER DETAILS
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-[#003943] text-base">{assignModalApp.assignedOfficerName}</h4>
                    <p className="text-xs text-[#00959C] font-semibold">State LMO Officer</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
                    ★ 4.9 Rating
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                  <span className="text-[#003943]/70 font-medium">Scheduled Inspection Date:</span>
                  <span className="font-mono font-bold text-[#003943]">{assignModalApp.scheduledInspectionDate || '28 Aug 2026'}</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold">
                ⚠️ No Verifier Assigned Yet — Ready to allocate LMO Inspector below.
              </div>
            )}

            {/* Assign / Change Officer Controls */}
            <div className="space-y-3 pt-2 border-t border-[#003943]/10">
              <p className="text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                {assignModalApp.assignedOfficerName ? 'Reassign / Change Officer' : 'Assign Authorized Officer'}
              </p>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#003943]">Select Officer / Centre</label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#003943]"
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.role} — ★ {off.rating})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#003943]">Scheduled Inspection Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#003943]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button variant="ghost" onClick={() => setAssignModalApp(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  loading={assignLoading}
                  onClick={async () => {
                    setAssignLoading(true);
                    await assignOfficer(assignModalApp.id, selectedOfficerId, scheduledDate, 'Assigned in Review Panel');
                    setAssignLoading(false);
                    setAssignModalApp(null);
                  }}
                >
                  Confirm & Save
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Offline Inspection Result Modal */}
      {inspectModalApp && (
        <Modal
          isOpen={!!inspectModalApp}
          onClose={() => setInspectModalApp(null)}
          title={`Record Offline Inspection Result: ${inspectModalApp.id}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 text-[#003943]">
            <div className="p-3.5 bg-[#FDF9F6] rounded-2xl border border-[#003943]/15 text-xs space-y-1">
              <span className="font-mono font-bold text-[#00959C]">{inspectModalApp.id}</span>
              <p className="font-serif font-bold text-[#003943] text-sm">{inspectModalApp.instrumentName}</p>
              <p className="text-[#003943]/70 font-medium">
                Assigned Inspector: <span className="font-bold text-[#003943]">{inspectModalApp.assignedOfficerName || 'Inspector Rajesh V. Sharma'}</span>
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#003943]/10 space-y-3 text-xs">
              <span className="font-bold text-xs uppercase tracking-wider text-[#00959C] block">
                Offline Physical Test Verification Checklist
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 font-bold">✓ Nameplate Checked</div>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 font-bold">✓ Model Approved</div>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 font-bold">✓ Max Capacity Check</div>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 font-bold">✓ Lead Seal Affixed</div>
              </div>
            </div>

            {/* Dynamic Technical Verification Section */}
            <DynamicTechnicalVerification instrumentName={inspectModalApp.instrumentName} applicationType={inspectModalApp.applicationType} />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                Inspection Outcome <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInspectionOutcome('PASS')}
                  className={`py-3 rounded-2xl font-bold text-xs transition-all ${
                    inspectionOutcome === 'PASS'
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  [ PASS / STAMP ]
                </button>

                <button
                  type="button"
                  onClick={() => setInspectionOutcome('FAIL')}
                  className={`py-3 rounded-2xl font-bold text-xs transition-all ${
                    inspectionOutcome === 'FAIL'
                      ? 'bg-red-700 text-white shadow-md'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  [ FAIL / REJECT ]
                </button>
              </div>

              {/* Reason for Failure Options */}
              {inspectionOutcome === 'FAIL' && (
                <div className="p-3.5 bg-red-50/90 rounded-2xl border border-red-200 space-y-2.5 animate-in fade-in duration-200 mt-2">
                  <label className="block font-extrabold text-xs uppercase tracking-wider text-red-900">
                    Reason for Failure <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'MPE exceeded',
                      'Nameplate mismatch',
                      'Seal damaged',
                      'Required marking missing',
                      'Instrument not functioning',
                      'Other'
                    ].map((reason) => (
                      <label
                        key={reason}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer font-bold transition-all ${
                          failReason === reason
                            ? 'bg-red-700 text-white border-red-800 shadow-xs'
                            : 'bg-white text-red-900 border-red-200 hover:bg-red-100/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reviewFailReason"
                          value={reason}
                          checked={failReason === reason}
                          onChange={(e) => setFailReason(e.target.value)}
                          className="w-3.5 h-3.5 accent-red-700"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                Officer Remarks & Observations
              </label>
              <textarea
                rows={2}
                value={inspectionRemarks}
                onChange={(e) => setInspectionRemarks(e.target.value)}
                className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl p-3 text-xs font-bold text-[#003943]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#003943]/10">
              <Button variant="ghost" onClick={() => setInspectModalApp(null)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                loading={inspectLoading}
                onClick={async () => {
                  setInspectLoading(true);
                  const finalObs = inspectionOutcome === 'FAIL'
                    ? `[Rejection Reason: ${failReason}] ${inspectionRemarks}`
                    : inspectionRemarks;

                  await submitVerificationResult({
                    applicationId: inspectModalApp.id,
                    result: inspectionOutcome,
                    observations: finalObs,
                    evidencePhotos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80'],
                    officerName: inspectModalApp.assignedOfficerName || 'Inspector Rajesh V. Sharma'
                  });
                  setInspectLoading(false);
                  setInspectModalApp(null);
                }}
              >
                Submit Inspection Result
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
