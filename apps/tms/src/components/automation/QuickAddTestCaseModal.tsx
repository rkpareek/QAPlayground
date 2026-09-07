import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TestCasePriority, TestType, AutomationStatus } from '../../types';
import { X, Plus, Sparkles, Zap, Layers, Folder, Tag } from 'lucide-react';

export const QuickAddTestCaseModal: React.FC = () => {
  const {
    isQuickAddModalOpen,
    setIsQuickAddModalOpen,
    quickAddTestCase,
    suites,
    folders,
    currentProject,
    testCases,
    hasPermission,
    addToast,
  } = useApp();

  const [title, setTitle] = useState('');
  const [suiteId, setSuiteId] = useState<string>('');
  const [folderId, setFolderId] = useState<string>('');
  const [priority, setPriority] = useState<TestCasePriority>('medium');
  const [testType, setTestType] = useState<TestType>('functional');
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>('manual_only');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['regression']);
  const [description, setDescription] = useState('');
  const [createAnother, setCreateAnother] = useState(false);

  // Initialize suite
  useEffect(() => {
    if (isQuickAddModalOpen) {
      const projSuites = suites.filter((s) => s.projectId === currentProject.id);
      if (projSuites.length > 0 && !suiteId) {
        setSuiteId(projSuites[0].id);
      }
    }
  }, [isQuickAddModalOpen, suites, currentProject.id, suiteId]);

  if (!isQuickAddModalOpen) return null;

  const projSuites = suites.filter((s) => s.projectId === currentProject.id);
  const suiteFolders = folders.filter((f) => f.projectId === currentProject.id && f.suiteId === suiteId);
  const nextCaseNumber = testCases.filter((tc) => tc.projectId === currentProject.id).length + 1;
  const projectedId = `${currentProject.key}-TC-${String(nextCaseNumber).padStart(4, '0')}`;

  const handleAddTag = () => {
    const clean = tagInput.trim().toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast({ type: 'error', title: 'Title is required' });
      return;
    }
    if (!hasPermission('testcase.create', 'suite', suiteId)) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to create test cases in this suite.' });
      return;
    }

    quickAddTestCase({
      title: title.trim(),
      suiteId: suiteId || projSuites[0]?.id || 'suite-default',
      folderId: folderId || undefined,
      priority,
      tags,
      testType,
      automationStatus,
      description,
    });

    if (createAnother) {
      setTitle('');
      setDescription('');
    } else {
      setIsQuickAddModalOpen(false);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">Quick Add Test Case</h2>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-blue-400 border border-slate-700">
                  {projectedId}
                </span>
              </div>
              <p className="text-xs text-slate-400">Streamlined authoring with instant suite routing</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickAddModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Test Case Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Verify MFA challenge on high-value wire transfers"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Target Suite <span className="text-rose-400">*</span>
              </label>
              <select
                value={suiteId}
                onChange={(e) => {
                  setSuiteId(e.target.value);
                  setFolderId('');
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              >
                {projSuites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                Target Section / Folder
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              >
                <option value="">(Root Level)</option>
                {suiteFolders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TestCasePriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Type</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value as TestType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              >
                <option value="functional">Functional</option>
                <option value="smoke">Smoke</option>
                <option value="regression">Regression</option>
                <option value="security">Security</option>
                <option value="performance">Performance</option>
                <option value="integration">Integration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Automation</label>
              <select
                value={automationStatus}
                onChange={(e) => setAutomationStatus(e.target.value as AutomationStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              >
                <option value="manual_only">Manual Only</option>
                <option value="automated">Automated</option>
                <option value="to_be_automated">To Be Automated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg min-h-10">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700"
                >
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-slate-500 hover:text-slate-300">
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter..."
                className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of verification criteria..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-600 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={createAnother}
                onChange={(e) => setCreateAnother(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              <span>Create another test case immediately</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsQuickAddModalOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Test Case
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
