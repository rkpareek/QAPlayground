import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Requirement, RequirementPriority, RequirementStatus } from '../../types';
import {
  ListTodo,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Trash2,
  Edit,
  X,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badges';

export const RequirementsView: React.FC = () => {
  const {
    currentProject,
    requirements,
    testCases,
    defects,
    releases,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    setNavSection,
    setSelectedTestCaseId,
    setSelectedRequirementId,
    selectedRequirementId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<RequirementPriority>('high');
  const [status, setStatus] = useState<RequirementStatus>('in_progress');
  const [releaseId, setReleaseId] = useState(releases[0]?.id || '');
  const [editingReq, setEditingReq] = useState<Requirement | null>(null);

  const projectReqs = useMemo(() => {
    return requirements.filter((req) => {
      if (req.projectId !== currentProject.id) return false;
      if (statusFilter !== 'all' && req.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && req.priority !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          req.id.toLowerCase().includes(q) ||
          req.title.toLowerCase().includes(q) ||
          req.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requirements, currentProject.id, statusFilter, priorityFilter, searchQuery]);

  const selectedReq = requirements.find((r) => r.id === selectedRequirementId) || projectReqs[0];

  // Linked test cases for selected requirement
  const linkedTestCases = useMemo(() => {
    if (!selectedReq) return [];
    return testCases.filter(
      (tc) => tc.projectId === currentProject.id && (tc.linkedRequirementIds?.includes(selectedReq.id) || selectedReq.linkedTestCaseIds?.includes(tc.id))
    );
  }, [selectedReq, testCases, currentProject.id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingReq) {
      updateRequirement(editingReq.id, {
        title,
        description,
        priority,
        status,
        releaseId,
      });
    } else {
      createRequirement({
        title,
        description,
        priority,
        status,
        releaseId,
      });
    }

    setIsCreateModalOpen(false);
    setEditingReq(null);
    setTitle('');
    setDescription('');
  };

  const handleOpenEdit = (req: Requirement) => {
    setEditingReq(req);
    setTitle(req.title);
    setDescription(req.description);
    setPriority(req.priority);
    setStatus(req.status);
    setReleaseId(req.releaseId || releases[0]?.id || '');
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* 1. LEFT PANE: Requirements List */}
      <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Requirements</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {projectReqs.length}
              </span>
            </div>

            <button
              onClick={() => {
                setEditingReq(null);
                setTitle('');
                setDescription('');
                setIsCreateModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-xs outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-1/2 px-2 py-1 rounded border border-slate-200 text-slate-700 text-xs bg-slate-50"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="implemented">Implemented</option>
                <option value="verified">Verified</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-1/2 px-2 py-1 rounded border border-slate-200 text-slate-700 text-xs bg-slate-50"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          {projectReqs.map((req) => {
            const isSelected = selectedReq?.id === req.id;
            const mappedCases = testCases.filter(
              (tc) => tc.projectId === currentProject.id && (tc.linkedRequirementIds?.includes(req.id) || req.linkedTestCaseIds?.includes(tc.id))
            );

            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequirementId(req.id)}
                className={`p-3.5 cursor-pointer transition-colors space-y-1.5 ${
                  isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-700">{req.id}</span>
                  <PriorityBadge priority={req.priority} />
                </div>
                <h4 className="font-semibold text-slate-900 line-clamp-1 leading-snug">{req.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span className="capitalize">{req.status.replace('_', ' ')}</span>
                  <span className="flex items-center gap-1 font-mono text-slate-600">
                    <FileCode className="w-3 h-3 text-blue-500" />
                    {mappedCases.length} tests
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. RIGHT PANE: Selected Requirement Detail & Mappings */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {selectedReq ? (
          <div className="space-y-6 max-w-4xl">
            {/* Header Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {selectedReq.id}
                  </span>
                  <PriorityBadge priority={selectedReq.priority} />
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                    {selectedReq.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedReq)}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600"
                    title="Edit Requirement"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete requirement ${selectedReq.id}?`)) {
                        deleteRequirement(selectedReq.id);
                      }
                    }}
                    className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600"
                    title="Delete Requirement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-lg font-bold text-slate-900">{selectedReq.title}</h1>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedReq.description}
              </p>
            </div>

            {/* Test Coverage Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Covering Test Cases ({linkedTestCases.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Test cases verifying this business specification and functional constraints.
                  </p>
                </div>

                <button
                  onClick={() => setNavSection('repository')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  Map in Repository <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {linkedTestCases.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                  <AlertCircle className="w-6 h-6 mx-auto text-amber-500 mb-1" />
                  No test cases mapped to this requirement yet. Uncovered requirement risk.
                </div>
              ) : (
                <div className="space-y-2">
                  {linkedTestCases.map((tc) => (
                    <div
                      key={tc.id}
                      onClick={() => {
                        setSelectedTestCaseId(tc.id);
                        setNavSection('repository');
                      }}
                      className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono font-bold text-slate-800 shrink-0">{tc.id}</span>
                        <span className="font-medium text-slate-900 truncate">{tc.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <PriorityBadge priority={tc.priority} />
                        <span className="text-[11px] text-slate-500 capitalize">{tc.testType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">Select a requirement to inspect details.</div>
        )}
      </div>

      {/* Modal: Create / Edit Requirement */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                {editingReq ? 'Edit Requirement' : 'Create Requirement'}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-Time Account Balance Sync across Mobile & Web"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="implemented">Implemented</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specification & Acceptance Criteria</label>
                <textarea
                  rows={4}
                  placeholder="Detailed functional rules and expected system behavior..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  {editingReq ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
