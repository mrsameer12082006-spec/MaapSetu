import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckSquare,
  Clock,
  CheckCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const OfficerDashboard = () => {
  const { user } = useAuth();
  const { applications } = useData();

  // Filter queue assigned to logged in officer or assigned queue
  const assignedQueue = applications.filter((a) => a.status === 'assigned' || a.status === 'in_progress');
  const completedQueue = applications.filter((a) => a.status === 'passed' || a.status === 'failed');

  return (
    <div className="space-y-6">
      {/* Officer Header Banner */}
      <div className="bg-white border border-neutral-300 rounded-card p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src={user ? user.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={user ? user.name : 'Officer'}
            className="w-14 h-14 rounded-full border-2 border-primary object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">{user ? user.name : 'Inspector Rajesh V. Sharma'}</h1>
              <Badge status="in_progress">Authorized LMO Officer</Badge>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Badge #LMO-NGP-442 • Zone: Nagpur Industrial Division & GATC Liaison
            </p>
          </div>
        </div>
        <Link to="/officer/queue">
          <Button variant="primary" icon={CheckSquare}>
            Open Verification Queue ({assignedQueue.length})
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Assigned Field Queue</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{assignedQueue.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Verifications Completed</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{completedQueue.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Today's Field Schedule</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">2 Inspections</p>
          </div>
        </Card>
      </div>

      {/* Assigned Inspections List */}
      <Card
        title="Assigned Verification Queue"
        subtitle="Physical inspections scheduled for execution"
        action={
          <Link to="/officer/queue" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            View Full Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {assignedQueue.length === 0 ? (
          <p className="text-xs text-neutral-600 italic py-6 text-center">No active field inspections assigned to your queue.</p>
        ) : (
          <div className="divide-y divide-neutral-300">
            {assignedQueue.map((app) => (
              <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{app.id}</span>
                    <Badge status={app.status}>{app.status}</Badge>
                  </div>
                  <h4 className="font-semibold text-neutral-900 text-sm">{app.instrumentName}</h4>
                  <p className="text-xs text-neutral-600">Applicant: {app.applicantName}</p>
                  <p className="text-xs text-neutral-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {app.inspectionLocation}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/officer/verify/new?appId=${app.id}`}>
                    <Button variant="accent" size="sm" icon={CheckSquare}>
                      Perform Verification Inspection
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
