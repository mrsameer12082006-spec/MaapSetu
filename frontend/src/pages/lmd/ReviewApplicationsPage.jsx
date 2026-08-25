import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileCheck, UserCheck, Eye, Check, X, MapPin, FileText, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const ReviewApplicationsPage = () => {
  const navigate = useNavigate();
  const { applications } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const pendingReviewApps = applications.filter((app) =>
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.instrumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedApp(row)}>
            Review Docs
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={UserCheck}
            onClick={() => navigate(`/lmd/assign?appId=${row.id}`)}
          >
            Assign Officer
          </Button>
        </div>
      )
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

            <div>
              <h4 className="text-xs font-semibold uppercase text-neutral-600 border-b pb-1 mb-2">Instrument Specs</h4>
              <p className="font-bold text-neutral-900">{selectedApp.instrumentName}</p>
              <p className="text-xs text-neutral-600 mt-1">Application Type: {selectedApp.applicationType}</p>
              <p className="text-xs text-neutral-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {selectedApp.inspectionLocation}
              </p>
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
    </div>
  );
};
