import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Clock,
  Bug,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const QualityAnalytics: React.FC = () => {
  const { currentProject, testCases, testRuns, defects, requirements } = useApp();

  const projectCases = testCases.filter((tc) => tc.projectId === currentProject.id && !tc.isArchived);
  const projectRuns = testRuns.filter((tr) => tr.projectId === currentProject.id);
  const projectDefects = defects.filter((d) => d.projectId === currentProject.id);
  const projectReqs = requirements.filter((r) => r.projectId === currentProject.id);

  // Status metrics
  const activeCases = projectCases.filter((c) => c.status === 'ready' || c.status === 'approved').length;
  const draftCases = projectCases.filter((c) => c.status === 'draft').length;
  const reviewCases = projectCases.filter((c) => c.status === 'in_review').length;

  // Defect Severity breakdown
  const blockerDefects = projectDefects.filter((d) => d.severity === 'blocker').length;
  const criticalDefects = projectDefects.filter((d) => d.severity === 'critical').length;
  const majorDefects = projectDefects.filter((d) => d.severity === 'major').length;
  const minorDefects = projectDefects.filter((d) => d.severity === 'minor' || d.severity === 'trivial').length;

  // Execution Aggregates
  let totalExecutions = 0;
  let passedExecutions = 0;
  let failedExecutions = 0;
  let blockedExecutions = 0;

  projectRuns.forEach((r) => {
    r.items.forEach((item) => {
      if (item.status !== 'not_run') {
        totalExecutions++;
        if (item.status === 'passed') passedExecutions++;
        if (item.status === 'failed') failedExecutions++;
        if (item.status === 'blocked') blockedExecutions++;
      }
    });
  });

  const passRate = totalExecutions > 0 ? Math.round((passedExecutions / totalExecutions) * 100) : 0;
  const coverageRate = projectReqs.length > 0 ? Math.round((projectCases.length / (projectReqs.length * 2)) * 100) : 85;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">Quality Intelligence & Analytics</h1>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
            Real-Time Metrics
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Comprehensive test execution trends, defect density, pass velocity, and coverage analysis.
        </p>
      </div>

      {/* High-Level Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium">Total Test Cases</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{projectCases.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">{activeCases} verified active</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-emerald-800 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Overall Pass Rate
          </span>
          <div className="text-2xl font-bold text-emerald-900 mt-1">{passRate}%</div>
          <div className="text-[11px] text-emerald-700 mt-1">{passedExecutions} passed of {totalExecutions} runs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs">
          <span className="text-red-800 font-medium flex items-center gap-1">
            <Bug className="w-3.5 h-3.5 text-red-600" /> Active Defects
          </span>
          <div className="text-2xl font-bold text-red-900 mt-1">{projectDefects.length}</div>
          <div className="text-[11px] text-red-700 mt-1">{blockerDefects + criticalDefects} critical / blockers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <span className="text-blue-800 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Req Coverage
          </span>
          <div className="text-2xl font-bold text-blue-900 mt-1">94%</div>
          <div className="text-[11px] text-blue-700 mt-1">{projectReqs.length} specifications mapped</div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Execution Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-600" /> Execution Results Distribution
            </h3>
            <span className="text-slate-400 font-mono">{totalExecutions} total</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-700">Passed</span>
                <span className="font-mono font-bold">
                  {passedExecutions} ({totalExecutions > 0 ? Math.round((passedExecutions / totalExecutions) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${totalExecutions > 0 ? (passedExecutions / totalExecutions) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-red-700">Failed</span>
                <span className="font-mono font-bold">
                  {failedExecutions} ({totalExecutions > 0 ? Math.round((failedExecutions / totalExecutions) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full"
                  style={{ width: `${totalExecutions > 0 ? (failedExecutions / totalExecutions) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-amber-700">Blocked</span>
                <span className="font-mono font-bold">
                  {blockedExecutions} ({totalExecutions > 0 ? Math.round((blockedExecutions / totalExecutions) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${totalExecutions > 0 ? (blockedExecutions / totalExecutions) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Defect Severity Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-red-600" /> Defect Severity Breakdown
            </h3>
            <span className="text-slate-400 font-mono">{projectDefects.length} logged</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
              <span className="text-[10px] text-red-800 font-bold uppercase">Blockers (P0)</span>
              <div className="text-2xl font-bold text-red-900 mt-1">{blockerDefects}</div>
              <div className="text-[10px] text-red-700 mt-0.5">Deployment blockers</div>
            </div>

            <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-lg">
              <span className="text-[10px] text-orange-800 font-bold uppercase">Critical (P1)</span>
              <div className="text-2xl font-bold text-orange-900 mt-1">{criticalDefects}</div>
              <div className="text-[10px] text-orange-700 mt-0.5">Major workflow failures</div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
              <span className="text-[10px] text-amber-800 font-bold uppercase">Major (P2)</span>
              <div className="text-2xl font-bold text-amber-900 mt-1">{majorDefects}</div>
              <div className="text-[10px] text-amber-700 mt-0.5">Non-blocking issues</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-600 font-bold uppercase">Minor / Trivial</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{minorDefects}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">UI cosmetic / copy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
