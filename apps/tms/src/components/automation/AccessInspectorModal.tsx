import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PermissionKey, ScopeType } from '../../types/automation';
import { ALL_PERMISSIONS } from '../../utils/permissions';
import { X, ShieldCheck, ShieldAlert, Users, Layers, Key, CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react';

export const AccessInspectorModal: React.FC = () => {
  const {
    isAccessInspectorOpen,
    setIsAccessInspectorOpen,
    users,
    currentUser,
    currentProject,
    suites,
    teams,
    customRoles,
    checkUserAccess,
  } = useApp();

  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [selectedPermission, setSelectedPermission] = useState<PermissionKey>('testcase.create');
  const [scopeType, setScopeType] = useState<ScopeType>('project');
  const [scopeTargetId, setScopeTargetId] = useState<string>(currentProject.id);

  if (!isAccessInspectorOpen) return null;

  const targetUser = users.find((u) => u.id === selectedUserId) || currentUser;
  const projSuites = suites.filter((s) => s.projectId === currentProject.id);

  // Evaluate access
  const accessResult = checkUserAccess(targetUser.id, selectedPermission, scopeType, scopeTargetId);

  // Find user's teams
  const userTeams = teams.filter((t) => t.memberIds.includes(targetUser.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">Enterprise Access & RBAC Inspector</h2>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Granular Scopes
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audit permission inheritance across built-in roles, custom roles, and team grants
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAccessInspectorOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Target User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-indigo-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role} - {u.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Permission Action Key
              </label>
              <select
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value as PermissionKey)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-indigo-500 font-mono"
              >
                {ALL_PERMISSIONS.map((perm) => (
                  <option key={perm.key} value={perm.key}>
                    {perm.key} ({perm.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Scope Boundary</label>
              <select
                value={scopeType}
                onChange={(e) => {
                  const newScope = e.target.value as ScopeType;
                  setScopeType(newScope);
                  setScopeTargetId(newScope === 'suite' ? projSuites[0]?.id || '' : currentProject.id);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-indigo-500"
              >
                <option value="workspace">Workspace Wide</option>
                <option value="project">Project Scope ({currentProject.name})</option>
                <option value="suite">Suite Scoped</option>
              </select>
            </div>

            {scopeType === 'suite' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Target Suite
                </label>
                <select
                  value={scopeTargetId}
                  onChange={(e) => setScopeTargetId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-indigo-500"
                >
                  {projSuites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Access Verdict Card */}
          <div
            className={`p-4 rounded-xl border ${
              accessResult.granted
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {accessResult.granted ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                )}
                <span className="text-sm font-semibold">
                  {accessResult.granted ? 'Access Granted' : 'Access Denied'}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-900/60">
                {selectedPermission}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-2">
              <span className="font-semibold text-slate-200">Evaluation Reason:</span> {accessResult.reason}
            </p>

            {accessResult.sourceName && (
              <div className="text-[11px] text-slate-400">
                <span className="font-medium text-slate-300">Grant Origin:</span>{' '}
                <code className="text-amber-300 font-mono">{accessResult.sourceName}</code>
              </div>
            )}
          </div>

          {/* User Teams & Roles Context */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300">User Identity & Membership Context</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
              <div>
                <span className="text-slate-500 block text-[11px]">Direct Role</span>
                <span className="font-medium text-slate-200 uppercase">{targetUser.role}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Assigned Teams</span>
                <span className="font-medium text-slate-200">
                  {userTeams.length > 0 ? userTeams.map((t) => t.name).join(', ') : 'None (Direct user only)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <button
            type="button"
            onClick={() => setIsAccessInspectorOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
