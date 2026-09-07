import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Defect, DefectSeverity, DefectStatus, DefectPriority } from '../../types';
import {
  Bug,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  X,
  Server,
  Layers,
} from 'lucide-react';
import { DefectBadge, PriorityBadge, SeverityBadge } from '../common/Badges';

export const DefectsView: React.FC = () => {
  const {
    currentProject,
    defects,
    testCases,
    testRuns,
    environments,
    users,
    createDefect,
    updateDefect,
    deleteDefect,
    selectedDefectId,
    setSelectedDefectId,
    setSelectedTestCaseId,
    setSelectedTestRunId,
    setNavSection,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDefect, setEditingDefect] = useState<Defect | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<DefectSeverity>('major');
  const [priority, setPriority] = useState<DefectPriority>('high');
  const [status, setStatus] = useState<DefectStatus>('open');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [linkedTestCaseId, setLinkedTestCaseId] = useState('');

  const projectDefects = useMemo(() => {
    return defects.filter((d) => {
      if (d.projectId !== currentProject.id) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (severityFilter !== 'all' && d.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.id.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [defects, currentProject.id, statusFilter, severityFilter, searchQuery]);

  const selectedDefect = defects.find((d) => d.id === selectedDefectId) || projectDefects[0];

  const handleOpenCreate = () => {
    setEditingDefect(null);
    setTitle('');
    setDescription('');
    setSeverity('major');
    setPriority('high');
    setStatus('open');
    setStepsToReproduce('');
    setActualBehavior('');
    setExpectedBehavior('');
    setAssigneeId(users[0]?.id || '');
    setLinkedTestCaseId('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (defect: Defect) => {
    setEditingDefect(defect);
    setTitle(defect.title);
    setDescription(defect.description || '');
    setSeverity(defect.severity);
    setPriority(defect.priority);
    setStatus(defect.status);
    setStepsToReproduce(defect.stepsToReproduce || '');
    setActualBehavior(defect.actualBehavior || '');
    setExpectedBehavior(defect.expectedBehavior || '');
    setAssigneeId(defect.assigneeId || '');
    setLinkedTestCaseId(defect.linkedTestCaseId || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      severity,
      priority,
      status,
      stepsToReproduce,
      actualBehavior,
      expectedBehavior,
      assigneeId,
      linkedTestCaseId: linkedTestCaseId || undefined,
    };

    if (editingDefect) {
      updateDefect(editingDefect.id, payload);
    } else {
      const created = createDefect(payload);
      setSelectedDefectId(created.id);
    }

    setIsModalOpen(false);
  };

  const handleStatusChange = (defectId: string, newStatus: DefectStatus) => {
    updateDefect(defectId, { status: newStatus });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* 1. LEFT PANE: Defects List */}
      <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Defects</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                {projectDefects.length}
              </span>
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Defect</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search defects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-xs outline-hidden focus:border-red-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-1/2 px-2 py-1 rounded border border-slate-200 text-slate-700 text-xs bg-slate-50"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-1/2 px-2 py-1 rounded border border-slate-200 text-slate-700 text-xs bg-slate-50"
              >
                <option value="all">All Severities</option>
                <option value="blocker">Blocker</option>
                <option value="critical">Critical</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
                <option value="trivial">Trivial</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          {projectDefects.map((defect) => {
            const isSelected = selectedDefect?.id === defect.id;

            return (
              <div
                key={defect.id}
                onClick={() => setSelectedDefectId(defect.id)}
                className={`p-3.5 cursor-pointer transition-colors space-y-1.5 ${
                  isSelected ? 'bg-red-50/70 border-l-4 border-red-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-red-900">{defect.id}</span>
                  <div className="flex items-center gap-1">
                    <SeverityBadge severity={defect.severity} />
                    <DefectBadge status={defect.status} />
                  </div>
                </div>
                <h4 className="font-semibold text-slate-900 line-clamp-1 leading-snug">{defect.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span className="capitalize font-medium text-slate-600">{defect.status.replace('_', ' ')}</span>
                  <span className="text-slate-400">
                    {new Date(defect.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. RIGHT PANE: Selected Defect Inspector */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {selectedDefect ? (
          <div className="space-y-6 max-w-4xl">
            {/* Header Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded">
                    {selectedDefect.id}
                  </span>
                  <SeverityBadge severity={selectedDefect.severity} />
                  <PriorityBadge priority={selectedDefect.priority} />
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick Status Selector */}
                  <select
                    value={selectedDefect.status}
                    onChange={(e) => handleStatusChange(selectedDefect.id, e.target.value as any)}
                    className="px-2.5 py-1 rounded-md border border-slate-300 text-xs font-semibold bg-white text-slate-800"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="reopened">Reopened</option>
                  </select>

                  <button
                    onClick={() => handleOpenEdit(selectedDefect)}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600"
                    title="Edit Defect"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete defect ${selectedDefect.id}?`)) {
                        deleteDefect(selectedDefect.id);
                      }
                    }}
                    className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600"
                    title="Delete Defect"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-lg font-bold text-slate-900">{selectedDefect.title}</h1>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Reporter</span>
                  <div className="text-slate-800 font-medium">{selectedDefect.reporter || 'Alex Chen'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Assignee</span>
                  <div className="text-slate-800 font-medium">
                    {users.find((u) => u.id === selectedDefect.assigneeId)?.name || 'Unassigned'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Environment</span>
                  <div className="text-slate-800 font-medium">{selectedDefect.environmentId || 'QA Sandbox'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Build Version</span>
                  <div className="text-slate-800 font-medium font-mono">{selectedDefect.buildVersion || '2.5.0-rc3'}</div>
                </div>
              </div>
            </div>

            {/* Reproduction Steps & Behavior */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 mb-1.5">Steps to Reproduce</h3>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {selectedDefect.stepsToReproduce || 'No reproduction steps documented.'}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-red-50/60 border border-red-200 rounded-lg space-y-1">
                  <span className="font-bold text-red-900 block text-[11px] uppercase">Observed Actual Behavior</span>
                  <p className="text-red-800 leading-relaxed">
                    {selectedDefect.actualBehavior || selectedDefect.description || 'Deviated from expected outcome.'}
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-1">
                  <span className="font-bold text-emerald-900 block text-[11px] uppercase">Expected Behavior</span>
                  <p className="text-emerald-800 leading-relaxed">
                    {selectedDefect.expectedBehavior || 'System should complete flow with 200 OK and no error.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Linked Entities */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-900">Linked Test Case & Execution Run</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedDefect.linkedTestCaseId ? (
                  <div
                    onClick={() => {
                      setSelectedTestCaseId(selectedDefect.linkedTestCaseId!);
                      setNavSection('repository');
                    }}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Origin Test Case</span>
                      <span className="font-mono font-bold text-blue-700">{selectedDefect.linkedTestCaseId}</span>
                      <div className="text-slate-800 font-medium truncate mt-0.5">
                        {testCases.find((tc) => tc.id === selectedDefect.linkedTestCaseId)?.title}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-slate-200 text-slate-400">
                    No linked test case.
                  </div>
                )}

                {selectedDefect.linkedRunId ? (
                  <div
                    onClick={() => {
                      setSelectedTestRunId(selectedDefect.linkedRunId!);
                      setNavSection('test-runs');
                    }}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Discovered in Run</span>
                      <span className="font-mono font-bold text-blue-700">{selectedDefect.linkedRunId}</span>
                      <div className="text-slate-800 font-medium truncate mt-0.5">
                        {testRuns.find((r) => r.id === selectedDefect.linkedRunId)?.name}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-slate-200 text-slate-400">
                    No linked execution run.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">Select a defect to inspect details.</div>
        )}
      </div>

      {/* Modal: Create / Edit Defect */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                {editingDefect ? 'Edit Defect' : 'Log New Defect'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Defect Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session cookies not invalidated on password reset"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
                  >
                    <option value="blocker">Blocker</option>
                    <option value="critical">Critical</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                    <option value="trivial">Trivial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
                  >
                    <option value="critical">P0 - Critical</option>
                    <option value="high">P1 - High</option>
                    <option value="medium">P2 - Medium</option>
                    <option value="low">P3 - Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Steps to Reproduce</label>
                <textarea
                  rows={3}
                  placeholder="1. Login as user...&#10;2. Request password reset...&#10;3. Observe session status"
                  value={stepsToReproduce}
                  onChange={(e) => setStepsToReproduce(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs font-mono outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actual Result</label>
                  <textarea
                    rows={2}
                    value={actualBehavior}
                    onChange={(e) => setActualBehavior(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Result</label>
                  <textarea
                    rows={2}
                    value={expectedBehavior}
                    onChange={(e) => setExpectedBehavior(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold shadow-xs"
                >
                  {editingDefect ? 'Update Defect' : 'Log Defect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
