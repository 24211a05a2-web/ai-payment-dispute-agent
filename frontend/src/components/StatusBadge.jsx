import React from 'react';

export default function StatusBadge({ status }) {
  const formatted = (status || 'UNKNOWN').toUpperCase();

  const styles = {
    RESOLVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    REFUND_INITIATED: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    UNDER_REVIEW: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    SUBMITTED: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    ESCALATED: 'bg-rose-500/10 text-rose-300 border-rose-500/30 font-semibold animate-pulse',
    REJECTED: 'bg-slate-700/40 text-slate-400 border-slate-600/30',
    ELIGIBLE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    NOT_ELIGIBLE: 'bg-slate-800 text-slate-400 border-slate-700',
    REQUIRES_REVIEW: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  };

  const icons = {
    RESOLVED: '✓',
    REFUND_INITIATED: '⚡',
    UNDER_REVIEW: '⏳',
    SUBMITTED: '📋',
    ESCALATED: '⚠️',
    REJECTED: '✕',
    ELIGIBLE: '✓',
    NOT_ELIGIBLE: '✕',
    REQUIRES_REVIEW: '🔍'
  };

  const badgeStyle = styles[formatted] || 'bg-slate-800 text-slate-300 border-slate-700';
  const icon = icons[formatted] || '•';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyle}`}>
      <span>{icon}</span>
      <span>{formatted.replace(/_/g, ' ')}</span>
    </span>
  );
}
