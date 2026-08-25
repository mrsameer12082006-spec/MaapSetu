import React, { useState } from 'react';
import { Search, Filter, Eye, Layers, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AllApplicationsPage = () => {
  const { applications } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.instrumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'App ID',
      key: 'id',
      render: (row) => <span className="font-mono font-bold text-primary text-xs">{row.id}</span>
    },
    {
      header: 'Applicant / Business',
      key: 'applicantName',
      render: (row) => (
        <div>
          <p className="font-semibold text-neutral-900">{row.applicantName}</p>
          <p className="text-[11px] text-neutral-600">Loc: {row.inspectionLocation.split(',')[0]}</p>
        </div>
      )
    },
    {
      header: 'Instrument Specifications',
      key: 'instrumentName',
      render: (row) => (
        <div>
          <p className="font-semibold text-neutral-900">{row.instrumentName}</p>
          <p className="text-[11px] text-neutral-600">{row.applicationType}</p>
        </div>
      )
    },
    {
      header: 'Assigned Verifier',
      key: 'assignedOfficerName',
      render: (row) => (
        <span className="text-xs font-medium text-neutral-900">
          {row.assignedOfficerName || <span className="text-neutral-600 italic">Unassigned</span>}
        </span>
      )
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
        <Button variant="ghost" size="sm" icon={Eye} onClick={() => setSelectedApp(row)}>
          Master Record
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Master Verification Registry</h1>
        <p className="text-xs text-neutral-600">Filter and search across all submitted, in-progress, passed, and failed verification records statewide.</p>
      </div>

      <Card className="p-4 bg-white">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search across all records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-input border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-600" />
            <span className="text-xs text-neutral-600 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-input border border-neutral-300 text-xs py-2 px-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All ({applications.length})</option>
              <option value="submitted">Submitted</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </Card>

      <Table columns={columns} data={filteredApps} emptyMessage="No records match query." />

      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Master Application Record: ${selectedApp.id}`}
          footer={<Button variant="secondary" onClick={() => setSelectedApp(null)}>Close Record</Button>}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-neutral-100 rounded border border-neutral-300 flex justify-between items-center">
              <div>
                <p className="font-bold text-neutral-900">{selectedApp.instrumentName}</p>
                <p className="text-neutral-600">{selectedApp.applicantName}</p>
              </div>
              <Badge status={selectedApp.status}>{selectedApp.status}</Badge>
            </div>

            <div>
              <p className="font-semibold text-neutral-900 border-b pb-1 mb-2">Audit History</p>
              <div className="space-y-2 pl-2 border-l-2 border-primary">
                {selectedApp.timeline.map((step, idx) => (
                  <div key={idx} className="text-[11px]">
                    <p className="font-semibold text-neutral-900">{step.step}</p>
                    <p className="text-neutral-600">{step.date} • {step.actor}</p>
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
