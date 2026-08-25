import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  FileText,
  Award,
  AlertTriangle,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const BusinessDashboard = () => {
  const { user } = useAuth();
  const { instruments, applications, certificates, activityLogs } = useData();

  const totalRegistered = instruments.length;
  const pendingApps = applications.filter((a) => ['submitted', 'under_review', 'assigned', 'in_progress'].includes(a.status)).length;
  const validCerts = certificates.filter((c) => new Date(c.expiryDate) > new Date()).length;
  const expiredOrWarningCerts = certificates.filter((c) => new Date(c.expiryDate) <= new Date()).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-neutral-300 rounded-card p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">Welcome, {user ? user.name : 'Business Owner'}</h1>
            <Badge status="active">Verified Business</Badge>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            {user ? user.organization : 'Apex Logistics'} • Jurisdiction: Maharashtra & All India Ports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/business/register">
            <Button variant="primary" icon={PlusCircle}>
              Register New Instrument
            </Button>
          </Link>
          <Link to="/business/apply">
            <Button variant="secondary" icon={FileText}>
              Apply for Verification
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Registered Instruments</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{totalRegistered}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Applications In Progress</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{pendingApps}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Valid Certificates</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{validCerts}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Expiring / Expired</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{expiredOrWarningCerts}</p>
          </div>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Recent Applications) */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Recent Verification Applications"
            subtitle="Track ongoing & recent verification applications"
            action={
              <Link to="/business/applications" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="divide-y divide-neutral-300">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{app.id}</span>
                      <Badge status={app.status}>{app.status}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 mt-1">{app.instrumentName}</p>
                    <p className="text-xs text-neutral-600">{app.applicationType} • Submitted: {app.submissionDate}</p>
                  </div>
                  <div className="text-right">
                    {app.assignedOfficerName ? (
                      <p className="text-xs font-medium text-neutral-900">{app.assignedOfficerName}</p>
                    ) : (
                      <p className="text-xs text-neutral-600 italic">Awaiting Officer Assignment</p>
                    )}
                    <p className="text-[11px] text-neutral-600 mt-0.5">Location: {app.inspectionLocation.split(',')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Instruments Overview List */}
          <Card
            title="Registered Weighing & Measuring Instruments"
            subtitle="Instruments linked to your business account"
            action={
              <Link to="/business/register" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                + Add New <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300 text-xs text-neutral-600 font-semibold uppercase">
                    <th className="py-2.5 px-3">Serial No</th>
                    <th className="py-2.5 px-3">Type & Model</th>
                    <th className="py-2.5 px-3">Capacity</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300 text-xs">
                  {instruments.map((inst) => (
                    <tr key={inst.id} className="hover:bg-neutral-100/50">
                      <td className="py-3 px-3 font-mono font-bold text-neutral-900">{inst.serialNumber}</td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-neutral-900">{inst.type}</p>
                        <p className="text-neutral-600 text-[11px]">{inst.manufacturer} {inst.model}</p>
                      </td>
                      <td className="py-3 px-3">{inst.capacity}</td>
                      <td className="py-3 px-3"><Badge status={inst.status}>{inst.status}</Badge></td>
                      <td className="py-3 px-3 text-right">
                        <Link to={`/business/apply?instId=${inst.id}`}>
                          <button className="text-primary hover:underline font-semibold text-xs">
                            Apply Verification
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column (Alerts & Activity Feed) */}
        <div className="space-y-6">
          {/* Action Reminder Card */}
          <Card className="bg-warning/5 border-warning/30 space-y-3">
            <div className="flex items-center gap-2 text-warning font-semibold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Mandatory Re-verification Notice</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Instrument <span className="font-mono font-bold text-neutral-900">GV-330198-F</span> (Fuel Dispensing Meter) expired on 2026-08-04.
              Commercial operation without verification is subject to legal action under Section 33.
            </p>
            <Link to="/business/apply?instId=INST-2026-003">
              <Button variant="danger" size="sm" className="w-full mt-2">
                Re-verify Fuel Pump Now
              </Button>
            </Link>
          </Card>

          {/* System Activity Stream */}
          <Card title="Live Activity Log" subtitle="Recent updates & verification events">
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="text-xs flex items-start gap-2.5 pb-2.5 border-b border-neutral-300 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-neutral-900 font-medium">{log.text}</p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-600 mt-0.5">
                      <span>{log.timestamp}</span>
                      <span>•</span>
                      <span>{log.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
