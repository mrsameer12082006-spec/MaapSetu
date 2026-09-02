import React, { useState } from 'react';
import { Search, Eye, Filter, Calendar, MapPin, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const MyApplicationsPage = () => {
  const { applications } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  const myApplications = applications.filter(app => !user || app.applicantId === user.id);
  const sortedApps = [...myApplications].sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate) || a.id.localeCompare(b.id));
  const searchedApps = sortedApps.filter((app) => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;
    return (
      app.id?.toLowerCase().includes(search) ||
      app.applicationNumber?.toLowerCase().includes(search) ||
      app.instrumentName?.toLowerCase().includes(search) ||
      app.applicationType?.toLowerCase().includes(search) ||
      app.assignedOfficerName?.toLowerCase().includes(search)
    );
  });

  const filteredApps = searchedApps.filter(app => statusFilter === 'all' || app.status === statusFilter);

  const getStatusCount = (status) => searchedApps.filter(app => status === 'all' ? true : app.status === status).length;

  const columns = [
    {
      header: 'App ID',
      key: 'id',
      render: (row) => <span className="font-mono font-bold text-primary text-xs">{row.id}</span>
    },
    {
      header: 'Instrument Name & Type',
      key: 'instrumentName',
      render: (row) => (
        <div>
          <p className="font-semibold text-neutral-900">{row.instrumentName}</p>
          <p className="text-[11px] text-neutral-600">{row.applicationType}</p>
        </div>
      )
    },
    {
      header: 'Submitted Date',
      key: 'submissionDate',
      render: (row) => <span className="text-xs text-neutral-600">{row.submissionDate}</span>
    },
    {
      header: 'Assigned Inspector',
      key: 'assignedOfficerName',
      render: (row) => (
        <span className="text-xs font-medium text-neutral-900">
          {row.assignedOfficerName || <span className="text-neutral-600 italic">Unassigned</span>}
        </span>
      )
    },
    {
      header: 'Scheduled Date',
      key: 'scheduledInspectionDate',
      render: (row) => (
        <span className="text-xs font-medium text-neutral-900">
          {row.scheduledInspectionDate || <span className="text-neutral-600 italic">-</span>}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: 'Action',
      key: 'action',
      render: (row) => (
        <Button variant="ghost" size="sm" icon={Eye} onClick={() => setSelectedApp(row)}>
          Details
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Verification Applications</h1>
        <p className="text-xs text-neutral-600">Track and monitor all verification and re-verification requests submitted to Legal Metrology.</p>
      </div>

      {/* Filter bar */}
      <Card className="bg-white p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Application ID or Instrument..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-input border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-600" />
            <span className="text-xs text-neutral-600 font-semibold">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-input border border-neutral-300 text-xs py-2 px-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All ({getStatusCount('all')})</option>
                <option value="submitted">Submitted ({getStatusCount('submitted')})</option>
                <option value="assigned">Assigned ({getStatusCount('assigned')})</option>
                <option value="in_progress">In Progress ({getStatusCount('in_progress')})</option>
                <option value="passed">Passed ({getStatusCount('passed')})</option>
                <option value="failed">Failed ({getStatusCount('failed')})</option>
              </select>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Table columns={columns} data={filteredApps} emptyMessage="No applications found matching criteria." />

      {/* Application Detail Modal */}
      {selectedApp && (
        <Modal maxWidth="max-w-4xl" isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Details: ${selectedApp.id}`}
          footer={
            <Button variant="secondary" onClick={() => setSelectedApp(null)}>
              Close View
            </Button>
          }
        >
          <div className="space-y-6 text-sm">
            {/* Header info */}
            <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg border border-neutral-300">
              <div>
                <p className="text-xs text-neutral-600 font-medium">Status</p>
                <Badge status={selectedApp.status}>{selectedApp.status}</Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-600">Submitted On</p>
                <p className="font-semibold text-neutral-900">{selectedApp.submissionDate}</p>
              </div>
            </div>

            {/* Instrument Info */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 border-b border-neutral-300 pb-1 mb-2">
                Instrument & Verification Scope
              </h4>
              <p className="font-bold text-neutral-900 text-base">{selectedApp.instrumentName}</p>
              <p className="text-xs text-neutral-600 mt-0.5">Type: {selectedApp.applicationType}</p>
              <p className="text-xs text-neutral-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{selectedApp.inspectionLocation}</span>
              </p>
            </div>

            {/* Assigned Officer */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 border-b border-neutral-300 pb-1 mb-2">
                Assigned Legal Metrology Verifier
              </h4>
              {selectedApp.assignedOfficerName ? (
                <div className="p-3 bg-primary-light/40 border border-primary/20 rounded-md text-xs">
                  <p className="font-bold text-neutral-900">{selectedApp.assignedOfficerName}</p>
                  <p className="text-neutral-600 mt-0.5">
                    Scheduled Inspection Date:{' '}
                    <span className="font-semibold text-neutral-900">{selectedApp.scheduledInspectionDate || 'TBD'}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-600 italic">
                  Currently under LMD administrative queue. Officer will be assigned shortly.
                </p>
              )}
            </div>

            {/* Verification Result Section */}
            {selectedApp.verification && (
              <div className={`p-4 rounded-xl border text-xs space-y-3 ${
                selectedApp.verification.outcome === 'PASS' 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`font-bold uppercase tracking-wider ${
                  selectedApp.verification.outcome === 'PASS' ? 'text-emerald-900' : 'text-red-900'
                }`}>
                  {selectedApp.verification.outcome === 'PASS' ? 'VERIFICATION PASSED' : 'VERIFICATION FAILED'}
                </p>

                {selectedApp.verification.outcome === 'FAIL' && (
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-500 uppercase">Reason for Failure</span>
                    <span className="font-semibold text-neutral-900">
                      {selectedApp.verification.rejectionReason || 'Not specified'}
                    </span>
                  </div>
                )}

                <div>
                  <span className="block text-[10px] font-bold text-neutral-500 uppercase">Officer Remarks</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedApp.verification.officerRemarks || 'No remarks provided.'}
                  </span>
                </div>

                {selectedApp.verificationHistory?.length > 1 && (
                  <div className="pt-2 border-t border-black/10 mt-2 space-y-1">
                    <span className="block text-[10px] font-bold text-neutral-500 uppercase">Prior Verification Attempts</span>
                    {selectedApp.verificationHistory.slice(1).map((hist, hIdx) => (
                      <div key={hIdx} className="p-2 bg-white/70 rounded text-[11px] flex justify-between items-center">
                        <div>
                          <span className="font-bold">Attempt #{selectedApp.verificationHistory.length - 1 - hIdx}: </span>
                          <span className={`font-bold ${hist.outcome === 'PASS' ? 'text-emerald-700' : 'text-red-700'}`}>{hist.outcome}</span>
                          {hist.rejectionReason && <span className="text-neutral-600"> — {hist.rejectionReason}</span>}
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {hist.createdAt ? new Date(hist.createdAt).toLocaleDateString('en-IN') : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 border-b border-neutral-300 pb-1 mb-3">
                Workflow Progress History
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-primary/30 ml-2">
                {selectedApp.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary absolute -left-[19px] top-1 border-2 border-white" />
                    <p className="text-xs font-semibold text-neutral-900">{step.step}</p>
                    <p className="text-[10px] text-neutral-600">
                      {step.date} • by {step.actor}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 border-b border-neutral-300 pb-1 mb-2">
                Attached Documents ({selectedApp.documents.length})
              </h4>
              <div className="space-y-2">
                {selectedApp.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-neutral-100 rounded border border-neutral-300 text-xs">
                    <span className="font-medium text-neutral-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> {doc.name}
                    </span>
                    <span className="text-[10px] text-neutral-600">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};






