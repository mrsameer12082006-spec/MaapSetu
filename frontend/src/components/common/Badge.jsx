import React from 'react';

export const Badge = ({ children, status = 'default', className = '' }) => {
  // Normalize status text
  const statusLower = String(status || children || '').toLowerCase();

  let colorClasses = 'bg-neutral-100 text-neutral-900 border-neutral-300';

  // Green / Pass / Valid / Approved / Verified
  if (
    ['pass', 'passed', 'valid', 'verified', 'approved', 'active'].includes(statusLower)
  ) {
    // 10% opacity background of #0F8A65 -> bg-[#0F8A65]/10 text-[#0F8A65] border-[#0F8A65]/30
    colorClasses = 'bg-accent/10 text-accent border-accent/40';
  }
  // Amber / Warning / Pending / Under Review / Submitted / Expiring Soon
  else if (
    ['pending', 'submitted', 'under_review', 'pending verification', 'expiring', 'needs review', 'warning'].includes(statusLower)
  ) {
    colorClasses = 'bg-warning/10 text-warning border-warning/40';
  }
  // Red / Danger / Fail / Failed / Rejected / Expired
  else if (
    ['fail', 'failed', 'rejected', 'expired', 'danger'].includes(statusLower)
  ) {
    colorClasses = 'bg-danger/10 text-danger border-danger/40';
  }
  // Blue / Info / Assigned / In Progress
  else if (
    ['assigned', 'in_progress', 'in progress', 'processing', 'info'].includes(statusLower)
  ) {
    colorClasses = 'bg-primary/10 text-primary border-primary/40';
  }

  // Format displayed text nicely if string is enum-like (e.g. under_review -> Under Review)
  const displayContent = typeof children === 'string'
    ? children.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : children;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0" />
      {displayContent}
    </span>
  );
};
