import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlayCircle,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  GitCommit,
  GitBranch,
  Search,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

export const AutomationRunsView: React.FC = () => {
  const { currentProject, automationRuns, triggerMockAutomationRun, addToast } = useApp();
  const [selectedRunId, setSelectedRunId] = useState<string | null>(automationRuns[0]?.id || null);

  const projectRuns = automationRuns.filter((r) => r.projectId === currentProject.id);
  const activeRun = projectRuns.find((r) => r.id === selectedRunId) || projectRuns[0];

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* 1. LEFT PANE: Run History */}
      <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">CI/CD Automation Runs</h2>
            <p className="text-xs text-slate-500 mt-0.5">GitHub Actions, Jenkins & Nightly pipelines</p>
          </div>

          <button
            onClick={() => {
              const run = triggerMockAutomationRun('playwright');
              if (run) {
                setSelectedRunId(run.id);
                addToast({
                  type: 'success',
                  title: 'Pipeline Triggered',
                  message: `New CI/CD run ${run.id} started.`,
                });
              }
            }}
            className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Trigger</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          {projectRuns.map((run) => {
            const isSelected = activeRun?.id === run.id;

            return (
              <div
                key={run.id}
                onClick={() => setSelectedRunId(run.id)}
                className={`p-3.5 cursor-pointer transition-colors space-y-1.5 ${
                  isSelected ? 'bg-purple-50/70 border-l-4 border-purple-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800">{run.id}</span>
                  {run.failed === 0 ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      PASSED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800">
                      FAILED ({run.failed})
                    </span>
                  )}
                </div>

                <div className="font-semibold text-slate-900 line-clamp-1">{run.runName}</div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-slate-400" />
                    {run.branch || 'main'}
                  </span>
                  <span>{run.durationSeconds}s runtime</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. RIGHT PANE: Run Log & Details */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {activeRun ? (
          <div className="space-y-6 max-w-4xl">
            {/* Run Header */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                    {activeRun.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Runner: {activeRun.runner || 'GitLab CI/CD'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>{activeRun.startTime ? new Date(activeRun.startTime).toLocaleDateString() : ''}</span>
                  <span>{activeRun.startTime ? new Date(activeRun.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
              </div>

              <h1 className="text-lg font-bold text-slate-900">{activeRun.runName}</h1>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Executed</span>
                  <span className="font-bold text-slate-900 text-base">{activeRun.totalTests}</span>
                </div>
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase block">Passed</span>
                  <span className="font-bold text-emerald-800 text-base">{activeRun.passed}</span>
                </div>
                <div className="p-3 bg-red-50/70 border border-red-100 rounded-lg">
                  <span className="text-[10px] text-red-700 font-semibold uppercase block">Failed</span>
                  <span className="font-bold text-red-800 text-base">{activeRun.failed}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Duration</span>
                  <span className="font-bold text-slate-900 text-base">{activeRun.durationSeconds}s</span>
                </div>
              </div>
            </div>

            {/* Terminal Output Log */}
            <div className="bg-slate-950 text-slate-200 p-5 rounded-xl border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="font-mono font-bold text-slate-300">Raw Console Logs</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">Exit Code 0</span>
              </div>

              <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80">
                {activeRun.logs ||
                  `[INFO] Starting headless runner...\n[PASS] Auth suite tests executed (1.2s)\n[PASS] Transfers balance sync verified (2.4s)\n[DONE] All automated suites finished.`}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">Select a run to view execution logs.</div>
        )}
      </div>
    </div>
  );
};
