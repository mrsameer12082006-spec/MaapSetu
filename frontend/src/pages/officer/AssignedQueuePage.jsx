import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckSquare, MapPin, Eye, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AssignedQueuePage = () => {
  const navigate = useNavigate();
  const { applications } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Queue assigned to officer or active
  const assignedList = applications.filter((app) =>
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
      header: 'Inspection Address',
      key: 'inspectionLocation',
      render: (row) => (
        <span className="text-xs text-neutral-600 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {row.inspectionLocation.split(',')[0]}
        </span>
      )
    },
    {
      header: 'Scheduled Date',
      key: 'scheduledInspectionDate',
      render: (row) => <span className="text-xs font-semibold text-neutral-900">{row.scheduledInspectionDate || row.preferredDate}</span>
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
        <Button
          variant={row.status === 'passed' ? 'secondary' : 'accent'}
          size="sm"
          icon={CheckSquare}
          onClick={() => navigate(`/officer/verify/new?appId=${row.id}`)}
        >
          {row.status === 'passed' ? 'View Record' : 'Perform Inspection'}
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Assigned Inspection Queue</h1>
        <p className="text-xs text-neutral-600">
          Field inspections assigned to your officer account. Record observations and issue PASS/FAIL outcomes.
        </p>
      </div>

      <Card className="p-4 bg-white">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search queue by App ID, instrument name, or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-input border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      <Table columns={columns} data={assignedList} emptyMessage="No verifications currently assigned." />
    </div>
  );
};
