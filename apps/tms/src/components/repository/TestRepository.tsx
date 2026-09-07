import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TestCase, TestCasePriority, TestCaseStatus, TestType, AutomationStatus } from '../../types';
import {
  FolderTree,
  Folder,
  Plus,
  Search,
  Filter,
  Layers,
  FileCode,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Archive,
  RotateCcw,
  PlayCircle,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronDown,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  PriorityBadge,
  SeverityBadge,
  StatusBadge,
  AutomationBadge,
} from '../common/Badges';
import { TestCaseEditorModal } from './TestCaseEditorModal';
import { TestCasePreviewDrawer } from './TestCasePreviewDrawer';

export const TestRepository: React.FC = () => {
  const {
    currentProject,
    suites,
    folders,
    testCases,
    labels,
    createTestCase,
    createSuite,
    createFolder,
    deleteSuite,
    deleteFolder,
    deleteTestCase,
    duplicateTestCase,
    archiveTestCase,
    restoreTestCase,
    bulkUpdateTestCases,
    bulkDeleteTestCases,
    createTestRun,
    selectedTestCaseId,
    setSelectedTestCaseId,
    selectedSuiteId,
    setSelectedSuiteId,
    selectedFolderId,
    setSelectedFolderId,
    setNavSection,
    setSelectedTestRunId,
    setIsQuickAddModalOpen,
  } = useApp();

  // Modals & Drawers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Tree UI state
  const [expandedSuites, setExpandedSuites] = useState<Record<string, boolean>>({
    'suite-auth': true,
    'suite-transfers': true,
    'suite-accounts': true,
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAutomation, setFilterAutomation] = useState<string>('all');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Project Suites & Folders
  const projectSuites = useMemo(() => suites.filter((s) => s.projectId === currentProject.id), [suites, currentProject.id]);
  const projectFolders = useMemo(() => folders.filter((f) => f.projectId === currentProject.id), [folders, currentProject.id]);

  // Filtered Test Cases
  const filteredCases = useMemo(() => {
    return testCases.filter((tc) => {
      if (tc.projectId !== currentProject.id) return false;
      if (showArchived) {
        if (!tc.isArchived) return false;
      } else {
        if (tc.isArchived) return false;
      }

      // Suite & Folder Filter
      if (selectedFolderId) {
        if (tc.folderId !== selectedFolderId) return false;
      } else if (selectedSuiteId) {
        if (tc.suiteId !== selectedSuiteId) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          tc.id.toLowerCase().includes(q) ||
          tc.title.toLowerCase().includes(q) ||
          tc.description?.toLowerCase().includes(q) ||
          tc.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Priority Filter
      if (filterPriority !== 'all' && tc.priority !== filterPriority) return false;

      // Status Filter
      if (filterStatus !== 'all' && tc.status !== filterStatus) return false;

      // Type Filter
      if (filterType !== 'all' && tc.testType !== filterType) return false;

      // Automation Filter
      if (filterAutomation !== 'all' && tc.automationStatus !== filterAutomation) return false;

      return true;
    });
  }, [
    testCases,
    currentProject.id,
    showArchived,
    selectedSuiteId,
    selectedFolderId,
    searchQuery,
    filterPriority,
    filterStatus,
    filterType,
    filterAutomation,
  ]);

  // Bulk actions handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredCases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCases.map((tc) => tc.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkRun = () => {
    if (selectedIds.length === 0) return;
    const run = createTestRun(
      {
        name: `Sprint Run (${selectedIds.length} Cases) - ${new Date().toLocaleDateString()}`,
        environmentId: 'env-qa',
        buildVersion: '2.5.0-rc3',
      },
      selectedIds
    );
    setSelectedIds([]);
    setSelectedTestRunId(run.id);
    setNavSection('test-runs');
  };

  const handleBulkPriority = (priority: TestCasePriority) => {
    bulkUpdateTestCases(selectedIds, { priority });
    setSelectedIds([]);
  };

  const handleBulkStatus = (status: TestCaseStatus) => {
    bulkUpdateTestCases(selectedIds, { status });
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    bulkUpdateTestCases(selectedIds, { isArchived: true });
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Permanently delete ${selectedIds.length} test cases?`)) {
      bulkDeleteTestCases(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredCases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentProject.key}_test_repository.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        parsed.forEach((tc) => {
          createTestCase({
            title: tc.title || 'Imported Test Case',
            description: tc.description,
            priority: tc.priority || 'medium',
            testType: tc.testType || 'functional',
            steps: tc.steps || [{ id: 's1', stepNumber: 1, action: 'Execute test', expectedResult: 'Pass' }],
          });
        });
        setIsImportModalOpen(false);
        setImportJsonText('');
      }
    } catch (err) {
      alert('Invalid JSON structure. Please check the format.');
    }
  };

  const toggleSuiteExpand = (suiteId: string) => {
    setExpandedSuites((prev) => ({ ...prev, [suiteId]: !prev[suiteId] }));
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* 1. LEFT PANE: Suite & Folder Hierarchy Tree */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none">
        {/* Tree Header */}
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs uppercase tracking-wide">
            <FolderTree className="w-4 h-4 text-blue-600" />
            <span>Repository Tree</span>
          </div>

          <button
            onClick={() => {
              const name = prompt('Enter new Suite name:');
              if (name) createSuite(name);
            }}
            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
            title="Create Suite"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tree Root Selectors */}
        <div className="p-2 space-y-0.5 text-xs border-b border-slate-100">
          <button
            onClick={() => {
              setSelectedSuiteId(null);
              setSelectedFolderId(null);
              setShowArchived(false);
            }}
            className={`w-full px-2.5 py-1.5 rounded-md text-left flex items-center justify-between font-medium transition-colors ${
              !selectedSuiteId && !selectedFolderId && !showArchived
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>All Test Cases</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {testCases.filter((tc) => tc.projectId === currentProject.id && !tc.isArchived).length}
            </span>
          </button>

          <button
            onClick={() => {
              setShowArchived(true);
              setSelectedSuiteId(null);
              setSelectedFolderId(null);
            }}
            className={`w-full px-2.5 py-1.5 rounded-md text-left flex items-center justify-between font-medium transition-colors ${
              showArchived ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Archive className="w-3.5 h-3.5 text-amber-500" />
              <span>Archived Cases</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {testCases.filter((tc) => tc.projectId === currentProject.id && tc.isArchived).length}
            </span>
          </button>
        </div>

        {/* Tree Hierarchy List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Suites & Sections
          </div>

          {projectSuites.map((suite) => {
            const suiteFolders = projectFolders.filter((f) => f.suiteId === suite.id);
            const suiteCases = testCases.filter((tc) => tc.suiteId === suite.id && !tc.isArchived);
            const isSelected = selectedSuiteId === suite.id && !selectedFolderId;
            const isExpanded = expandedSuites[suite.id] ?? true;

            return (
              <div key={suite.id} className="space-y-0.5">
                <div
                  className={`flex items-center justify-between px-2 py-1.5 rounded-md group transition-colors ${
                    isSelected ? 'bg-blue-100/70 text-blue-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div
                    className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      setSelectedSuiteId(suite.id);
                      setSelectedFolderId(null);
                      setShowArchived(false);
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSuiteExpand(suite.id);
                      }}
                      className="p-0.5 text-slate-400 hover:text-slate-700"
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                    <Folder className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{suite.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400">{suiteCases.length}</span>
                    <button
                      onClick={() => {
                        const fname = prompt(`Add folder to suite "${suite.name}":`);
                        if (fname) createFolder(suite.id, fname);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 transition-opacity"
                      title="Add Folder"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Sub Folders */}
                {isExpanded && suiteFolders.length > 0 && (
                  <div className="pl-5 space-y-0.5 border-l border-slate-200 ml-3">
                    {suiteFolders.map((fld) => {
                      const fldCases = testCases.filter((tc) => tc.folderId === fld.id && !tc.isArchived);
                      const isFldSelected = selectedFolderId === fld.id;

                      return (
                        <div
                          key={fld.id}
                          onClick={() => {
                            setSelectedSuiteId(suite.id);
                            setSelectedFolderId(fld.id);
                            setShowArchived(false);
                          }}
                          className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                            isFldSelected
                              ? 'bg-blue-100 text-blue-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Folder className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{fld.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{fldCases.length}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CENTER PANE: Test Case Table & Actions */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Repository Toolbar */}
        <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {showArchived
                    ? 'Archived Test Cases'
                    : selectedFolderId
                    ? folders.find((f) => f.id === selectedFolderId)?.name
                    : selectedSuiteId
                    ? suites.find((s) => s.id === selectedSuiteId)?.name
                    : 'All Test Repository'}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {filteredCases.length} cases
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage test specifications, execution parameters, and automated mappings.
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Export JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export</span>
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Import JSON / CSV"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Import</span>
              </button>
              <button
                onClick={() => setIsQuickAddModalOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Quick Add Case"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick Add</span>
              </button>
              <button
                onClick={() => {
                  setEditingTestCase(null);
                  setIsEditorOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Test Case</span>
              </button>
            </div>
          </div>

          {/* Search & Filters Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter by title, ID, tag (e.g. TC-0001, auth)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-xs outline-hidden focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
            >
              <option value="all">All Statuses</option>
              <option value="ready">Ready</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="draft">Draft</option>
              <option value="deprecated">Deprecated</option>
            </select>

            {/* Test Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
            >
              <option value="all">All Types</option>
              <option value="functional">Functional</option>
              <option value="regression">Regression</option>
              <option value="smoke">Smoke</option>
              <option value="security">Security</option>
              <option value="negative">Negative</option>
            </select>

            {/* Automation Filter */}
            <select
              value={filterAutomation}
              onChange={(e) => setFilterAutomation(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
            >
              <option value="all">All Automation</option>
              <option value="automated">Automated</option>
              <option value="manual_only">Manual Only</option>
              <option value="automation_planned">Planned</option>
            </select>
          </div>

          {/* Bulk Action Bar (Visible when items selected) */}
          {selectedIds.length > 0 && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-900">{selectedIds.length} cases selected</span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-[11px] text-blue-600 hover:text-blue-800 underline"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkRun}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 shadow-2xs"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Execute in Run</span>
                </button>

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkPriority(e.target.value as any);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="px-2 py-1 rounded border border-blue-300 bg-white text-slate-700 text-xs"
                >
                  <option value="" disabled>Set Priority...</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatus(e.target.value as any);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="px-2 py-1 rounded border border-blue-300 bg-white text-slate-700 text-xs"
                >
                  <option value="" disabled>Set Status...</option>
                  <option value="ready">Ready</option>
                  <option value="approved">Approved</option>
                  <option value="draft">Draft</option>
                </select>

                <button
                  onClick={handleBulkArchive}
                  className="p-1 rounded text-slate-600 hover:text-amber-700"
                  title="Archive Selected"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="p-1 rounded text-slate-600 hover:text-red-700"
                  title="Delete Selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Test Cases Table */}
        <div className="flex-1 overflow-y-auto">
          {filteredCases.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <FileCode className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700 text-sm">No test cases match criteria</p>
              <p className="text-xs text-slate-400">
                Try clearing filters or create a new test case for this section.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px] z-10">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <button onClick={handleSelectAll} className="text-slate-500 hover:text-slate-800">
                      {selectedIds.length === filteredCases.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3 w-28">ID</th>
                  <th className="p-3">Title & Summary</th>
                  <th className="p-3 w-24">Priority</th>
                  <th className="p-3 w-24">Status</th>
                  <th className="p-3 w-24">Type</th>
                  <th className="p-3 w-28">Automation</th>
                  <th className="p-3 w-20 text-center">Steps</th>
                  <th className="p-3 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((tc) => {
                  const isChecked = selectedIds.includes(tc.id);
                  const isSelected = selectedTestCaseId === tc.id;

                  return (
                    <tr
                      key={tc.id}
                      onClick={() => setSelectedTestCaseId(tc.id)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60' : isChecked ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleToggleSelect(tc.id)} className="text-slate-400 hover:text-slate-700">
                          {isChecked ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>

                      <td className="p-3 font-mono font-bold text-slate-800">
                        {tc.id}
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                          {tc.title}
                        </div>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {tc.tags && tc.tags.length > 0 && tc.tags.slice(0, 4).map((tag) => {
                            const matchedLabel = labels.find((l) => l.name.toLowerCase() === tag.toLowerCase());
                            return (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium border"
                                style={
                                  matchedLabel
                                    ? { backgroundColor: `${matchedLabel.color}15`, color: matchedLabel.color, borderColor: `${matchedLabel.color}40` }
                                    : { backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }
                                }
                              >
                                {matchedLabel && (
                                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: matchedLabel.color }} />
                                )}
                                {tag}
                              </span>
                            );
                          })}
                          {tc.tags && tc.tags.length > 4 && (
                            <span className="text-[10px] text-slate-400 font-medium">+{tc.tags.length - 4}</span>
                          )}
                          {tc.customFields && Object.keys(tc.customFields).length > 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono" title="Has custom field values">
                              {Object.keys(tc.customFields).length} CF
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <PriorityBadge priority={tc.priority} />
                      </td>

                      <td className="p-3">
                        <StatusBadge status={tc.status} />
                      </td>

                      <td className="p-3 capitalize text-slate-700 font-medium">
                        {tc.testType}
                      </td>

                      <td className="p-3">
                        <AutomationBadge status={tc.automationStatus} />
                      </td>

                      <td className="p-3 text-center font-mono text-slate-600">
                        {tc.steps?.length || 0}
                      </td>

                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingTestCase(tc);
                              setIsEditorOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => duplicateTestCase(tc.id)}
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {tc.isArchived ? (
                            <button
                              onClick={() => restoreTestCase(tc.id)}
                              className="p-1.5 rounded hover:bg-slate-200 text-emerald-600"
                              title="Restore"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => archiveTestCase(tc.id)}
                              className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-amber-600"
                              title="Archive"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 3. RIGHT PANE: Test Case Preview Drawer */}
      {selectedTestCaseId && (
        <TestCasePreviewDrawer
          testCaseId={selectedTestCaseId}
          onClose={() => setSelectedTestCaseId(null)}
          onEdit={(tc) => {
            setEditingTestCase(tc);
            setIsEditorOpen(true);
          }}
        />
      )}

      {/* 4. MODAL: Test Case Full Editor */}
      <TestCaseEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingTestCase(null);
        }}
        testCase={editingTestCase}
        defaultSuiteId={selectedSuiteId || undefined}
        defaultFolderId={selectedFolderId || undefined}
      />

      {/* 5. MODAL: Import JSON */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Import Test Cases (JSON Format)</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600">
              Paste an array of test case JSON objects containing title, description, priority, and steps.
            </p>

            <textarea
              rows={8}
              placeholder={`[\n  {\n    "title": "Verify OAuth refresh token expiry",\n    "priority": "high",\n    "testType": "security",\n    "steps": [\n      { "stepNumber": 1, "action": "Wait for token expiry", "expectedResult": "Redirects to re-login" }\n    ]\n  }\n]`}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs outline-hidden"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Import Cases
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
