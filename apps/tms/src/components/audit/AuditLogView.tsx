import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Search,
  Filter,
  User,
  Clock,
  Layers,
  FileCode,
  PlayCircle,
  Bug,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { currentProject, activityLogs, users } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const getUserName = (userId: string) => {
    const u = users.find((user) => user.id === userId);
    return u?.name || userId || 'System';
  };

  const projectLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      if (log.projectId && log.projectId !== '*' && log.projectId !== currentProject.id) return false;
      if (actionFilter !== 'all' && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const uName = getUserName(log.userId).toLowerCase();
        return (
          log.entityId.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.entityName.toLowerCase().includes(q) ||
          uName.includes(q) ||
          log.entityType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activityLogs, currentProject.id, actionFilter, searchQuery, users]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">System Audit Trail & Compliance Log</h1>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
            Immutable History
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Full forensic audit log of entity creations, status updates, test executions, and configuration changes.
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by user, entity ID, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-xs outline-hidden focus:border-blue-500"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
        >
          <option value="all">All Actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="executed">Executed</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="divide-y divide-slate-100 text-xs">
          {projectLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No audit events recorded yet.</div>
          ) : (
            projectLogs.map((log) => {
              const uName = getUserName(log.userId);
              return (
                <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-200">
                    {uName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{uName}</span>
                      <span className="text-slate-500">performed</span>
                      <span className="font-mono font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 text-[10px]">
                        {log.action}
                      </span>
                      <span className="text-slate-500">on</span>
                      <span className="font-mono font-bold text-blue-700">{log.entityName || log.entityId}</span>
                      <span className="text-slate-400 capitalize">({log.entityType})</span>
                    </div>

                    {log.details && (
                      <div className="text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200">
                        {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
