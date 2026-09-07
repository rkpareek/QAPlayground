import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Label } from '../../types';
import {
  Tag,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  FolderGit2,
  Sparkles,
  GitMerge,
  HelpCircle,
  Hash,
} from 'lucide-react';

export const LabelManagementTab: React.FC = () => {
  const {
    labels,
    testCases,
    currentUser,
    projects,
    createLabel,
    updateLabel,
    deleteLabel,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Label['category']>('general');
  const [targetProjectId, setTargetProjectId] = useState<string>('all');

  // Merge state
  const [sourceLabelName, setSourceLabelName] = useState('');
  const [targetLabelName, setTargetLabelName] = useState('');

  const isOwnerOrAdmin =
    currentUser.role === 'owner' ||
    currentUser.isOwner ||
    currentUser.role === 'admin' ||
    currentUser.role === 'qa_lead';

  const COLOR_PALETTE = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#64748b', // Slate
    '#059669', // Dark Emerald
    '#b91c1c', // Deep Crimson
  ];

  // Calculate usage telemetry for each label across test cases
  const labelUsageMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    testCases.forEach((tc) => {
      tc.tags?.forEach((tag) => {
        const normalized = tag.toLowerCase().trim();
        map[normalized] = (map[normalized] || 0) + 1;
      });
    });
    return map;
  }, [testCases]);

  const filteredLabels = labels.filter((lbl) => {
    const matchesSearch =
      lbl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lbl.description && lbl.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || lbl.category === categoryFilter;
    const matchesProject =
      projectFilter === 'all' ||
      (projectFilter === 'global' ? !lbl.projectId : lbl.projectId === projectFilter);

    return matchesSearch && matchesCategory && matchesProject;
  });

  const handleOpenCreate = () => {
    setName('');
    setColor('#3b82f6');
    setDescription('');
    setCategory('general');
    setTargetProjectId('all');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createLabel({
      name: name.trim().toLowerCase().replace(/\s+/g, '-'),
      color,
      description: description.trim(),
      category,
      projectId: targetProjectId === 'all' ? undefined : targetProjectId,
    });

    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (lbl: Label) => {
    setSelectedLabel(lbl);
    setName(lbl.name);
    setColor(lbl.color);
    setDescription(lbl.description || '');
    setCategory(lbl.category || 'general');
    setTargetProjectId(lbl.projectId || 'all');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabel) return;

    updateLabel(selectedLabel.id, {
      name: name.trim().toLowerCase().replace(/\s+/g, '-'),
      color,
      description: description.trim(),
      category,
      projectId: targetProjectId === 'all' ? undefined : targetProjectId,
    });

    setIsEditModalOpen(false);
    setSelectedLabel(null);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header Overview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Labels & Tag Registry</h2>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {labels.length} Registered Labels
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardize metadata across test cases, track label usage telemetry, enforce naming conventions, and assign colors.
          </p>
        </div>

        {isOwnerOrAdmin && (
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Label</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search labels by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 focus:bg-white"
            >
              <option value="all">All Categories</option>
              <option value="regression">Regression & Smoke</option>
              <option value="security">Security & Compliance</option>
              <option value="automation">Automation & CI</option>
              <option value="priority">Priority & Blockers</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 focus:bg-white"
            >
              <option value="all">All Scopes (Global + Project)</option>
              <option value="global">Global Only (All Projects)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  Project: {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Labels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLabels.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            No labels found matching your search or filters. Click "Create Label" above to create one.
          </div>
        ) : (
          filteredLabels.map((lbl) => {
            const usageCount = labelUsageMap[lbl.name.toLowerCase()] || 0;
            const project = projects.find((p) => p.id === lbl.projectId);

            return (
              <div
                key={lbl.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all p-4 flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-2xs flex items-center gap-1.5"
                        style={{ backgroundColor: lbl.color }}
                      >
                        <Tag className="w-3 h-3" />
                        {lbl.name}
                      </span>
                    </div>

                    {isOwnerOrAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(lbl)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Edit Label"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete label "${lbl.name}"? This will remove it from future suggestions.`)) {
                              deleteLabel(lbl.id);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Label"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {lbl.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {usageCount} Test Case{usageCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div>
                    {project ? (
                      <span className="text-slate-600 font-medium">{project.key} Only</span>
                    ) : (
                      <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
                        Global
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: CREATE LABEL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Create New Label</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Label Tag Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. p0-blocker, smoke, zero-trust"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Label Color</label>
                <div className="flex items-center gap-2 py-1 flex-wrap">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        color === c ? 'scale-110 border-slate-900 ring-2 ring-blue-400' : 'border-white'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Label['category'])}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  >
                    <option value="general">General</option>
                    <option value="regression">Regression</option>
                    <option value="security">Security</option>
                    <option value="automation">Automation</option>
                    <option value="compliance">Compliance</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Scope</label>
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                  >
                    <option value="all">Global (All Projects)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Explain when QA engineers should apply this label to test cases..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              {/* Preview */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Live Preview</span>
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-bold text-white inline-flex items-center gap-1.5"
                  style={{ backgroundColor: color }}
                >
                  <Tag className="w-3 h-3" />
                  {name.trim() || 'sample-tag'}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Label
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT LABEL */}
      {isEditModalOpen && selectedLabel && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Edit Label: {selectedLabel.name}</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Label Tag Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color</label>
                <div className="flex items-center gap-2 py-1 flex-wrap">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        color === c ? 'scale-110 border-slate-900 ring-2 ring-blue-400' : 'border-white'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Label['category'])}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  >
                    <option value="general">General</option>
                    <option value="regression">Regression</option>
                    <option value="security">Security</option>
                    <option value="automation">Automation</option>
                    <option value="compliance">Compliance</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Scope</label>
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                  >
                    <option value="all">Global (All Projects)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Update Label
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
