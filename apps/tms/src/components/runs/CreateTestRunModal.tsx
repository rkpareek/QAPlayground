import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  PlayCircle,
  Calendar,
  CheckCircle2,
  Layers,
  Server,
  User,
  Search,
  CheckSquare,
  Square,
} from 'lucide-react';
import { PriorityBadge } from '../common/Badges';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTestRunModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    currentProject,
    testCases,
    suites,
    environments,
    releases,
    users,
    createTestRun,
    setSelectedTestRunId,
    setNavSection,
  } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [environmentId, setEnvironmentId] = useState(environments[0]?.id || 'env-qa');
  const [releaseId, setReleaseId] = useState(releases[0]?.id || 'rel-2.5');
  const [buildVersion, setBuildVersion] = useState('2.5.0-rc3');
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'all' | 'suite' | 'custom'>('all');
  const [selectedSuiteId, setSelectedSuiteId] = useState(suites[0]?.id || '');
  const [caseSearch, setCaseSearch] = useState('');

  if (!isOpen) return null;

  const projectCases = testCases.filter((tc) => tc.projectId === currentProject.id && !tc.isArchived);

  // Available test cases based on selection mode
  const selectableCases = projectCases.filter((tc) => {
    if (selectionMode === 'suite' && selectedSuiteId) {
      if (tc.suiteId !== selectedSuiteId) return false;
    }
    if (caseSearch.trim()) {
      const q = caseSearch.toLowerCase();
      return tc.id.toLowerCase().includes(q) || tc.title.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleCase = (id: string) => {
    if (selectedCaseIds.includes(id)) {
      setSelectedCaseIds(selectedCaseIds.filter((item) => item !== id));
    } else {
      setSelectedCaseIds([...selectedCaseIds, id]);
    }
  };

  const handleSelectAllSelectable = () => {
    const selectableIds = selectableCases.map((c) => c.id);
    const allSelected = selectableIds.every((id) => selectedCaseIds.includes(id));

    if (allSelected) {
      setSelectedCaseIds(selectedCaseIds.filter((id) => !selectableIds.includes(id)));
    } else {
      setSelectedCaseIds(Array.from(new Set([...selectedCaseIds, ...selectableIds])));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // If 'all' mode, take all project test cases
    const finalIds =
      selectionMode === 'all'
        ? projectCases.map((tc) => tc.id)
        : selectedCaseIds.length > 0
        ? selectedCaseIds
        : projectCases.slice(0, 5).map((tc) => tc.id);

    const created = createTestRun(
      {
        name,
        description,
        environmentId,
        releaseId,
        buildVersion,
      },
      finalIds
    );

    onClose();
    setSelectedTestRunId(created.id);
    setNavSection('test-execution');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create New Test Run</h2>
            <p className="text-xs text-slate-500 mt-0.5">Project: {currentProject.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Test Run Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Release 2.5.0 Regression Verification"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Environment</label>
              <select
                value={environmentId}
                onChange={(e) => setEnvironmentId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
              >
                {environments.map((env) => (
                  <option key={env.id} value={env.id}>
                    {env.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Release</label>
              <select
                value={releaseId}
                onChange={(e) => setReleaseId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
              >
                {releases.map((rel) => (
                  <option key={rel.id} value={rel.id}>
                    {rel.name} ({rel.version})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Build / Tag</label>
              <input
                type="text"
                value={buildVersion}
                onChange={(e) => setBuildVersion(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description / Goals</label>
            <textarea
              rows={2}
              placeholder="Testing objective and scope of this execution cycle..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs outline-hidden"
            />
          </div>

          {/* Test Case Selection Strategy */}
          <div className="space-y-3 pt-2">
            <div className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Select Test Cases to Include</span>
              <span className="text-blue-600 font-bold">
                {selectionMode === 'all' ? projectCases.length : selectedCaseIds.length} cases chosen
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectionMode('all')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                  selectionMode === 'all'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>All Test Cases</div>
                <div className="text-[11px] text-slate-500 font-normal">
                  Include all {projectCases.length} cases
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectionMode('suite')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                  selectionMode === 'suite'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>By Specific Suite</div>
                <div className="text-[11px] text-slate-500 font-normal">Filter by functional suite</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectionMode('custom')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                  selectionMode === 'custom'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>Custom Selection</div>
                <div className="text-[11px] text-slate-500 font-normal">Pick individual test cases</div>
              </button>
            </div>

            {/* Custom / Suite Picker Table */}
            {selectionMode !== 'all' && (
              <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                <div className="flex items-center justify-between gap-2">
                  {selectionMode === 'suite' && (
                    <select
                      value={selectedSuiteId}
                      onChange={(e) => setSelectedSuiteId(e.target.value)}
                      className="px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-800"
                    >
                      {suites.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="relative flex-1">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      value={caseSearch}
                      onChange={(e) => setCaseSearch(e.target.value)}
                      className="w-full pl-6 pr-2 py-1 rounded border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectAllSelectable}
                    className="px-2.5 py-1 rounded border border-slate-300 hover:bg-white text-slate-700 text-xs font-medium"
                  >
                    Toggle All Visible
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-slate-200 border border-slate-200 rounded bg-white">
                  {selectableCases.map((tc) => {
                    const isChecked = selectedCaseIds.includes(tc.id);

                    return (
                      <div
                        key={tc.id}
                        onClick={() => handleToggleCase(tc.id)}
                        className="p-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="font-mono font-bold text-slate-700 shrink-0">{tc.id}</span>
                          <span className="text-slate-900 truncate">{tc.title}</span>
                        </div>
                        <PriorityBadge priority={tc.priority} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
            >
              Create & Launch Cockpit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
