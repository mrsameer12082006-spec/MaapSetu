import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  UserCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Users
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const LmdDashboard = () => {
  const { user } = useAuth();
  const { applications, officers, certificates, activityLogs } = useData();

  const totalApps = applications.length;
  const unassignedApps = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review');
  const assignedApps = applications.filter((a) => a.status === 'assigned' || a.status === 'in_progress');
  const completedApps = applications.filter((a) => a.status === 'passed' || a.status === 'failed');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-neutral-300 rounded-card p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">
              LMD Administrative Control Dashboard
            </h1>
            <Badge status="assigned">State Controller View</Badge>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            {user ? user.organization : 'Legal Metrology Department, Govt of Maharashtra'} • Division: Statewide Regional Inspectorates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/lmd/review">
            <Button variant="primary" icon={FileCheck}>
              Review Incoming Queue ({unassignedApps.length})
            </Button>
          </Link>
          <Link to="/lmd/assign">
            <Button variant="secondary" icon={UserCheck}>
              Assign Officers
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Unassigned Queue</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{unassignedApps.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Active Field Verifications</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{assignedApps.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Verifications Completed</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{completedApps.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Active LMOs & GATCs</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{officers.length}</p>
          </div>
        </Card>
      </div>

      {/* Main Administrative Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Unassigned Applications Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Applications Needing Administrative Action"
            subtitle="Review documents and assign LMO inspectors or GATC test centers"
            action={
              <Link to="/lmd/review" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                Open Review Portal <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {unassignedApps.length === 0 ? (
              <p className="text-xs text-neutral-600 italic py-6 text-center">
                All incoming applications have been reviewed and assigned!
              </p>
            ) : (
              <div className="divide-y divide-neutral-300">
                {unassignedApps.map((app) => (
                  <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">{app.id}</span>
                        <Badge status={app.status}>{app.status}</Badge>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 mt-1">{app.instrumentName}</p>
                      <p className="text-xs text-neutral-600">Applicant: {app.applicantName} • Submitted: {app.submissionDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/lmd/assign?appId=${app.id}`}>
                        <Button variant="primary" size="sm" icon={UserCheck}>
                          Assign Officer
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Officers Workload Table */}
          <Card title="Inspector & GATC Roster Overview" subtitle="Real-time officer assignment & workload tracking">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300 text-neutral-600 font-semibold uppercase">
                    <th className="py-2.5 px-3">Officer Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Zone / Jurisdiction</th>
                    <th className="py-2.5 px-3 text-center">Active Load</th>
                    <th className="py-2.5 px-3 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300">
                  {officers.map((off) => (
                    <tr key={off.id} className="hover:bg-neutral-100/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img src={off.avatar} alt={off.name} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-neutral-900">{off.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-neutral-600">{off.role}</td>
                      <td className="py-3 px-3 text-neutral-600">{off.zone}</td>
                      <td className="py-3 px-3 text-center font-bold text-primary">{off.activeCount} verifications</td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-700">★ {off.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: Admin Live Feed & Analytics */}
        <div className="space-y-6">
          <Card title="Statewide Compliance Metrics" subtitle="Monthly verification targets">
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-neutral-900">Verification SLA Compliance</span>
                  <span className="font-bold text-accent">94.2%</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[94.2%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-neutral-900">GATC Audit Passed</span>
                  <span className="font-bold text-primary">98.0%</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[98%]" />
                </div>
              </div>

              <div className="p-3 bg-neutral-100 rounded border border-neutral-300 leading-relaxed">
                <p className="font-semibold text-neutral-900">Legal Metrology Compliance Rule 14:</p>
                <p className="text-neutral-600 text-[11px] mt-0.5">
                  All weighing applications must be processed within 7 working days of submission.
                </p>
              </div>
            </div>
          </Card>

          {/* Audit Feed */}
          <Card title="Departmental Audit Stream" subtitle="Administrative activity log">
            <div className="space-y-3 text-xs">
              {activityLogs.map((log) => (
                <div key={log.id} className="pb-2 border-b border-neutral-300 last:border-0 last:pb-0">
                  <p className="font-medium text-neutral-900">{log.text}</p>
                  <p className="text-[10px] text-neutral-600 mt-0.5">{log.timestamp} • {log.user}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
