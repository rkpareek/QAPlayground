import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export const AutomationAnalyticsView: React.FC = () => {
  const { currentProject, automatedTests, automationRuns } = useApp();

  const projectTests = automatedTests.filter((t) => t.projectId === currentProject.id);
  const totalAutomated = projectTests.length;
  const flakyTests = projectTests.filter((t) => (t.flakinessScore ?? (t.isFlaky ? 15 : 0)) > 5);

  // Framework distribution
  const playwrightCount = projectTests.filter((t) => t.framework === 'playwright').length;
  const cypressCount = projectTests.filter((t) => t.framework === 'cypress').length;
  const junitCount = projectTests.filter((t) => t.framework === 'junit').length;
  const jestCount = projectTests.filter((t) => t.framework === 'jest').length;

  // ROI estimate: avg manual test takes 4.5 minutes, automated takes 2 seconds
  const totalRunsCount = 142; // estimated cumulative runs
  const hoursSaved = Math.round((totalAutomated * totalRunsCount * 4.5) / 60);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">Automation Health & Flakiness Analytics</h1>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
            Engineered Stability
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Detect intermittent flakiness, pipeline bottlenecks, and return on engineering investment.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold uppercase text-[10px]">QA Hours Saved</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{hoursSaved} hrs</div>
          <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Equivalent to ~2.8 full-time QA manual sprints
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Automation Coverage</span>
            <Zap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-900">68%</div>
          <p className="text-xs text-slate-500">{totalAutomated} of active test cases automated</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Flakiness Alert Index</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-amber-900">{flakyTests.length}</div>
          <p className="text-xs text-amber-700 font-medium">Tests with intermittent failures requiring triage</p>
        </div>
      </div>

      {/* Flakiness Radar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Flakiness Radar & Intermittent Failures
            </h3>
            <p className="text-xs text-slate-500">
              Tests that intermittently flip status between runs due to network delays, race conditions, or DOM timing.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-lg overflow-hidden">
          {flakyTests.map((t) => (
            <div key={t.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-purple-900">{t.id}</span>
                  <span className="font-semibold text-slate-900">{t.name}</span>
                </div>
                <div className="font-mono text-[11px] text-slate-500">{t.filePath}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Flake Score</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">{t.flakinessScore ?? (t.isFlaky ? 15 : 0)}%</span>
                </div>
                <span className="px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                  Requires Quarantine
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Framework Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Framework Technology Stack</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-100">
            <span className="text-[10px] text-purple-700 font-bold uppercase">Playwright</span>
            <div className="text-xl font-bold text-purple-900 mt-1">{playwrightCount} specs</div>
            <div className="text-[11px] text-purple-700 mt-0.5">E2E Web & Mobile</div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-bold uppercase">Cypress</span>
            <div className="text-xl font-bold text-emerald-900 mt-1">{cypressCount} specs</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Component & E2E</div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100">
            <span className="text-[10px] text-blue-700 font-bold uppercase">JUnit / PyTest</span>
            <div className="text-xl font-bold text-blue-900 mt-1">{junitCount} specs</div>
            <div className="text-[11px] text-blue-700 mt-0.5">Backend REST APIs</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-600 font-bold uppercase">Jest / Vitest</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{jestCount} specs</div>
            <div className="text-[11px] text-slate-600 mt-0.5">Unit & Micro-services</div>
          </div>
        </div>
      </div>
    </div>
  );
};
