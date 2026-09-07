import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AutomatedTest, AutomationFramework } from '../../types';
import {
  Zap,
  PlayCircle,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Code,
  FileCode,
  Layers,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  GitBranch as Gitlab,
  BarChart3,
  FileSpreadsheet,
  Key,
  Upload,
} from 'lucide-react';
import { AutomationSourceExplorer } from './AutomationSourceExplorer';
import { GitLabIntegrationView } from './GitLabIntegrationView';
import { AutomationAnalyticsView } from './AutomationAnalyticsView';
import { NpmReporterView } from './NpmReporterView';
import { TestCaseSyncView } from './TestCaseSyncView';

export const AutomatedTestsView: React.FC = () => {
  const {
    currentProject,
    automatedTests,
    automationRuns,
    triggerMockAutomationRun,
    testCases,
    setNavSection,
    setSelectedTestCaseId,
    activeAutomationTab,
    setActiveAutomationTab,
    setIsAstImportModalOpen,
    setIsXmlImportModalOpen,
    setIsQuickAddModalOpen,
    setIsAccessInspectorOpen,
    hasPermission,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLog, setExecutingLog] = useState<string[]>([]);

  const projectTests = useMemo(() => {
    return automatedTests.filter((a) => {
      if (a.projectId !== currentProject.id) return false;
      if (frameworkFilter !== 'all' && a.framework !== frameworkFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.id.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.filePath.toLowerCase().includes(q) ||
          a.suite?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [automatedTests, currentProject.id, frameworkFilter, searchQuery]);

  const handleRunAllAutomation = () => {
    if (!hasPermission('automation.execute')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to execute automated test runs.' });
      return;
    }

    setIsExecuting(true);
    setExecutingLog([
      `[${new Date().toLocaleTimeString()}] Initializing headless test runner...`,
      `[${new Date().toLocaleTimeString()}] Discovered ${projectTests.length} automated test specs`,
      `[${new Date().toLocaleTimeString()}] Spawning parallel browser workers (Chromium, Firefox, WebKit)...`,
    ]);

    setTimeout(() => {
      setExecutingLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Running Playwright auth tests: 2 passed, 0 failed (1,240ms)`,
      ]);
    }, 1000);

    setTimeout(() => {
      setExecutingLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Running Cypress transfers suite: 3 passed, 0 failed (2,180ms)`,
      ]);
    }, 2000);

    setTimeout(() => {
      triggerMockAutomationRun('playwright');
      setExecutingLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Execution complete! All pipeline results synced to TestOne.`,
      ]);
      setIsExecuting(false);
    }, 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 space-y-6">
      {/* Top Banner with Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-100">Automation-First Test Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              v2.5 Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Static AST code mapping, normalized JUnit XML ingestion, GitLab CI/CD execution, and RBAC governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAccessInspectorOpen(true)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Inspect Access & Roles"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>RBAC Inspector</span>
          </button>

          <button
            onClick={() => setIsAstImportModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import AST Specs</span>
          </button>

          <button
            onClick={() => setIsXmlImportModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Ingest JUnit XML</span>
          </button>

          <button
            onClick={handleRunAllAutomation}
            disabled={isExecuting}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-colors"
          >
            {isExecuting ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
            <span>{isExecuting ? 'Running Pipeline...' : 'Run Automated Suite'}</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveAutomationTab('tests')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeAutomationTab === 'tests'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Registry ({projectTests.length})</span>
        </button>

        <button
          onClick={() => setActiveAutomationTab('testcase_sync')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeAutomationTab === 'testcase_sync'
              ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Test Case Sync (CLI)</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">New</span>
        </button>

        <button
          onClick={() => setActiveAutomationTab('npm_reporter')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeAutomationTab === 'npm_reporter'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-blue-400" />
          <span>NPM Reporter & SDK</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">Playwright</span>
        </button>

        <button
          onClick={() => setActiveAutomationTab('source_explorer')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeAutomationTab === 'source_explorer'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>AST Source Explorer</span>
        </button>

        <button
          onClick={() => setActiveAutomationTab('pipeline')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeAutomationTab === 'pipeline'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Gitlab className="w-3.5 h-3.5 text-orange-400" />
          <span>GitLab CI/CD</span>
        </button>

        <button
          onClick={() => setActiveAutomationTab('analytics')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeAutomationTab === 'analytics'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Automation Analytics</span>
        </button>
      </div>

      {/* Tab 1: Tests Registry */}
      {activeAutomationTab === 'tests' && (
        <div className="space-y-4">
          {/* Live Runner Terminal Console (if triggered) */}
          {executingLog.length > 0 && (
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1 shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                  <Terminal className="w-4 h-4 text-blue-400" /> Live Runner Output Stream
                </span>
                {isExecuting ? (
                  <span className="text-[11px] text-amber-400 animate-pulse">Running workers...</span>
                ) : (
                  <span className="text-[11px] text-emerald-400">Finished (Exit Code 0)</span>
                )}
              </div>
              {executingLog.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          )}

          {/* Filter Row */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search automated tests by name, file path, or suite..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <select
              value={frameworkFilter}
              onChange={(e) => setFrameworkFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-800 text-slate-200 text-xs bg-slate-950 focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">All Frameworks</option>
              <option value="playwright">Playwright</option>
              <option value="cypress">Cypress</option>
              <option value="junit">JUnit</option>
              <option value="pytest">PyTest</option>
              <option value="mocha">Mocha</option>
            </select>
          </div>

          {/* Automated Tests Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 w-32">Automation ID</th>
                  <th className="p-3">Automated Test Name & Code Path</th>
                  <th className="p-3 w-28">Framework</th>
                  <th className="p-3 w-36">Mapped Case</th>
                  <th className="p-3 w-28">Last Run Result</th>
                  <th className="p-3 w-24 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projectTests.map((test) => {
                  const mappedCase = testCases.find((tc) => tc.id === test.linkedTestCaseId);

                  return (
                    <tr key={test.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-semibold text-blue-400">{test.id}</td>

                      <td className="p-3">
                        <div className="font-semibold text-slate-200">{test.name}</div>
                        <div className="font-mono text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <Code className="w-3 h-3 text-slate-400" />
                          <span>{test.filePath}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                          {test.framework}
                        </span>
                      </td>

                      <td className="p-3">
                        {mappedCase ? (
                          <button
                            onClick={() => {
                              setSelectedTestCaseId(mappedCase.id);
                              setNavSection('repository');
                            }}
                            className="text-blue-400 hover:text-blue-300 font-mono font-medium flex items-center gap-1"
                          >
                            <FileCode className="w-3 h-3" />
                            {mappedCase.id}
                          </button>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Unlinked</span>
                        )}
                      </td>

                      <td className="p-3">
                        {test.lastResult === 'passed' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3 h-3 text-rose-400" /> Failed
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right font-mono text-slate-400">
                        {test.durationMs ? `${(test.durationMs / 1000).toFixed(2)}s` : '2.50s'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Test Case Sync Studio */}
      {activeAutomationTab === 'testcase_sync' && <TestCaseSyncView />}

      {/* Tab 3: NPM Reporter & SDK */}
      {activeAutomationTab === 'npm_reporter' && <NpmReporterView />}

      {/* Tab 4: AST Source Explorer */}
      {activeAutomationTab === 'source_explorer' && <AutomationSourceExplorer />}

      {/* Tab 5: GitLab CI/CD */}
      {activeAutomationTab === 'pipeline' && <GitLabIntegrationView />}

      {/* Tab 6: Analytics */}
      {activeAutomationTab === 'analytics' && <AutomationAnalyticsView />}
    </div>
  );
};
