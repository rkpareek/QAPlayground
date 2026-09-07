import React from 'react';
import {
  TestCasePriority,
  TestCaseSeverity,
  TestCaseStatus,
  ExecutionStatus,
  RunStatus,
  PlanStatus,
  DefectStatus,
  AutomationStatus,
} from '../../types';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Clock,
  CircleDot,
  MinusCircle,
  Play,
  RotateCcw,
  Zap,
  FileCode2,
  Calendar,
  Layers,
  AlertTriangle,
} from 'lucide-react';

export const PriorityBadge: React.FC<{ priority: TestCasePriority; showIcon?: boolean }> = ({ priority, showIcon = true }) => {
  const config = {
    critical: { label: 'Critical', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
    high: { label: 'High', bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    medium: { label: 'Medium', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    low: { label: 'Low', bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  }[priority] || { label: priority, bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${config.bg} whitespace-nowrap`}>
      {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: TestCaseSeverity }> = ({ severity }) => {
  const config = {
    blocker: { label: 'Blocker', bg: 'bg-red-100 text-red-800 border-red-300' },
    critical: { label: 'Critical', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
    major: { label: 'Major', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
    minor: { label: 'Minor', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
    trivial: { label: 'Trivial', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
  }[severity] || { label: severity, bg: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} whitespace-nowrap`}>
      {config.label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TestCaseStatus }> = ({ status }) => {
  const config = {
    ready: { label: 'Ready', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    approved: { label: 'Approved', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    in_review: { label: 'In Review', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    draft: { label: 'Draft', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
    deprecated: { label: 'Deprecated', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    archived: { label: 'Archived', bg: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
  }[status] || { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} whitespace-nowrap`}>
      {config.label}
    </span>
  );
};

export const ExecutionBadge: React.FC<{ status: ExecutionStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const config = {
    passed: {
      label: 'Passed',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className={size === 'md' ? 'w-4 h-4 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />,
    },
    failed: {
      label: 'Failed',
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: <XCircle className={size === 'md' ? 'w-4 h-4 text-red-600' : 'w-3.5 h-3.5 text-red-600'} />,
    },
    blocked: {
      label: 'Blocked',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <AlertOctagon className={size === 'md' ? 'w-4 h-4 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />,
    },
    skipped: {
      label: 'Skipped',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <MinusCircle className={size === 'md' ? 'w-4 h-4 text-slate-500' : 'w-3.5 h-3.5 text-slate-500'} />,
    },
    retest: {
      label: 'Retest',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <RotateCcw className={size === 'md' ? 'w-4 h-4 text-indigo-600' : 'w-3.5 h-3.5 text-indigo-600'} />,
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Play className={size === 'md' ? 'w-4 h-4 text-blue-600' : 'w-3.5 h-3.5 text-blue-600'} />,
    },
    not_run: {
      label: 'Not Run',
      bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
      icon: <CircleDot className={size === 'md' ? 'w-4 h-4 text-zinc-400' : 'w-3.5 h-3.5 text-zinc-400'} />,
    },
  }[status] || {
    label: status,
    bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    icon: <CircleDot className="w-3.5 h-3.5 text-zinc-400" />,
  };

  const padding = size === 'md' ? 'px-2.5 py-1 text-sm font-semibold' : 'px-2 py-0.5 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border ${config.bg} ${padding} whitespace-nowrap`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export const AutomationBadge: React.FC<{ status: AutomationStatus }> = ({ status }) => {
  const config = {
    automated: { label: 'Automated', bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: <Zap className="w-3 h-3 text-sky-600" /> },
    manual_only: { label: 'Manual Only', bg: 'bg-slate-100 text-slate-600 border-slate-200', icon: <FileCode2 className="w-3 h-3 text-slate-400" /> },
    automation_planned: { label: 'Auto Planned', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <Clock className="w-3 h-3 text-indigo-500" /> },
    automation_failed: { label: 'Auto Broken', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: <AlertTriangle className="w-3 h-3 text-rose-500" /> },
  }[status] || { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.bg} whitespace-nowrap`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export const PlanBadge: React.FC<{ status: PlanStatus }> = ({ status }) => {
  const config = {
    planned: { label: 'Planned', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    in_progress: { label: 'In Progress', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    completed: { label: 'Completed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    at_risk: { label: 'At Risk', bg: 'bg-red-50 text-red-700 border-red-200' },
    draft: { label: 'Draft', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
    active: { label: 'Active', bg: 'bg-green-50 text-green-700 border-green-200' },
    approved: { label: 'Approved', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    in_review: { label: 'In Review', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    archived: { label: 'Archived', bg: 'bg-slate-100 text-slate-500 border-slate-200' },
  }[status] || { label: status, bg: 'bg-slate-100 text-slate-600 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} whitespace-nowrap`}>
      {config.label}
    </span>
  );
};

export const DefectBadge: React.FC<{ status: DefectStatus }> = ({ status }) => {
  const config = {
    open: { label: 'Open', bg: 'bg-red-50 text-red-700 border-red-200' },
    in_progress: { label: 'In Progress', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    resolved: { label: 'Resolved', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    reopened: { label: 'Reopened', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    closed: { label: 'Closed', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
    rejected: { label: 'Rejected', bg: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
  }[status] || { label: status, bg: 'bg-slate-100 text-slate-600 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} whitespace-nowrap`}>
      {config.label}
    </span>
  );
};

export const RunStatusBadge: React.FC<{ status: RunStatus }> = ({ status }) => {
  const config = {
    not_started: { label: 'Not Started', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    paused: { label: 'Paused', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    completed: { label: 'Completed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    archived: { label: 'Archived', bg: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
  }[status] || { label: status, bg: 'bg-slate-100 text-slate-600 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} whitespace-nowrap`}>
      {config.label}
    </span>
  );
};
