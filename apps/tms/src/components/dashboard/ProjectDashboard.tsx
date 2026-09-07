import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  CircleDot,
  Zap,
  Bug,
  Calendar,
  PlayCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { PriorityBadge, ExecutionBadge, StatusBadge, DefectBadge } from '../common/Badges';

export const ProjectDashboard: React.FC = () => {
  const {
    currentProject,
    testCases,
    testRuns,
    testPlans,
    defects,
    automatedTests,
    releases,
    activityLogs,
    setNavSection,
    setSelectedTestCaseId,
    setSelectedTestRunId,
    setSelectedDefectId,
    setIsQuickCreateOpen,
  } = useApp();

  // Metrics computation for current project
  const projectCases = useMemo(() => testCases.filter((tc) => tc.projectId === currentProject.id && !tc.isArchived), [testCases, currentProject.id]);
  const projectRuns = useMemo(() => testRuns.filter((r) => r.projectId === currentProject.id && !r.isArchived), [testRuns, currentProject.id]);
  const projectDefects = useMemo(() => defects.filter((d) => d.projectId === currentProject.id), [defects, currentProject.id]);
  const projectAutomated = useMemo(() => automatedTests.filter((a) => a.projectId === currentProject.id), [automatedTests, currentProject.id]);

  // Execution rollups from all items in recent runs
  const executionStats = useMemo(() => {
    let total = 0;
    let passed = 0;
    let failed = 0;
    let blocked = 0;
    let skipped = 0;
    let notRun = 0;

    projectRuns.forEach((run) => {
      run.items.forEach((item) => {
        total++;
        if (item.status === 'passed') passed++;
        else if (item.status === 'failed') failed++;
        else if (item.status === 'blocked') blocked++;
        else if (item.status === 'skipped') skipped++;
        else notRun++;
      });
    });

    const executed = passed + failed + blocked + skipped;
    const executionRate = total > 0 ? Math.round((executed / total) * 100) : 0;
    const passRate = executed > 0 ? Math.round((passed / executed) * 100) : 0;

    return { total, passed, failed, blocked, skipped, notRun, executed, executionRate, passRate };
  }, [projectRuns]);

  // Automated vs Manual
  const automatedCount = projectCases.filter((tc) => tc.automationStatus === 'automated').length;
  const autoCoveragePercent = projectCases.length > 0 ? Math.round((automatedCount / projectCases.length) * 100) : 0;

  // Open & Critical Defects
  const openDefects = projectDefects.filter((d) => d.status === 'open' || d.status === 'in_progress');
  const criticalDefects = openDefects.filter((d) => d.severity === 'critical' || d.severity === 'blocker');

  // Release Readiness Indicator
  const releaseScore = useMemo(() => {
    if (executionStats.total === 0) return { score: 'Needs Runs', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-300' };
    if (criticalDefects.length > 0 || executionStats.passRate < 75) {
      return { score: 'At Risk', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
    }
    if (executionStats.passRate >= 90 && executionStats.executionRate >= 85) {
      return { score: 'Ready to Release', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    }
    return { score: 'Stabilizing', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  }, [executionStats, criticalDefects]);

  // Recent Failed tests
  const failedRunItems = useMemo(() => {
    const items: Array<{ runId: string; testCaseId: string; title: string; runName: string; executedAt?: string }> = [];
    projectRuns.forEach((r) => {
      r.items.filter((it) => it.status === 'failed').forEach((it) => {
        items.push({
          runId: r.id,
          testCaseId: it.testCaseId,
          title: it.testCaseSnapshot?.title || it.testCaseId,
          runName: r.name,
          executedAt: it.executedAt,
        });
      });
    });
    return items.slice(0, 5);
  }, [projectRuns]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Banner: Project Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{currentProject.name}</h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {currentProject.key}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">{currentProject.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNavSection('repository')}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            Repository
          </button>
          <button
            onClick={() => setNavSection('test-execution')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Execute Tests
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Test Cases</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{projectCases.length}</div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Automated: {automatedCount}</span>
            <span className="font-semibold text-slate-700">{autoCoveragePercent}% cov</span>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Execution Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {executionStats.passRate}%
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{executionStats.passed} Passed</span>
            <span className="text-red-600 font-semibold">{executionStats.failed} Failed</span>
          </div>
        </div>

        {/* Execution Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Execution Progress</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {executionStats.executionRate}%
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{executionStats.executed} of {executionStats.total}</span>
            <span>{executionStats.notRun} Remaining</span>
          </div>
        </div>

        {/* Release Readiness */}
        <div className={`p-4 rounded-xl border shadow-2xs ${releaseScore.bg} ${releaseScore.border}`}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Release Readiness</span>
            <ShieldAlert className="w-4 h-4 text-slate-600" />
          </div>
          <div className={`text-xl font-bold mt-2 ${releaseScore.color}`}>
            {releaseScore.score}
          </div>
          <div className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span>Open Defects: {openDefects.length}</span>
            <span className="font-semibold text-red-600">{criticalDefects.length} Blocker</span>
          </div>
        </div>
      </div>

      {/* Visual Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Execution Distribution Breakdown */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Test Execution Breakdown</h3>
              <p className="text-xs text-slate-500">Live aggregated results across active test execution cycles</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              {executionStats.total} total tests
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            {executionStats.total > 0 && (
              <>
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${(executionStats.passed / executionStats.total) * 100}%` }}
                  title={`Passed: ${executionStats.passed}`}
                />
                <div
                  className="bg-red-500 h-full transition-all duration-500"
                  style={{ width: `${(executionStats.failed / executionStats.total) * 100}%` }}
                  title={`Failed: ${executionStats.failed}`}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${(executionStats.blocked / executionStats.total) * 100}%` }}
                  title={`Blocked: ${executionStats.blocked}`}
                />
                <div
                  className="bg-slate-300 h-full transition-all duration-500"
                  style={{ width: `${(executionStats.notRun / executionStats.total) * 100}%` }}
                  title={`Not Run: ${executionStats.notRun}`}
                />
              </>
            )}
          </div>

          {/* Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg">
              <div className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passed
              </div>
              <div className="text-lg font-bold text-emerald-900 mt-1">{executionStats.passed}</div>
              <div className="text-[10px] text-emerald-700">
                {executionStats.total > 0 ? Math.round((executionStats.passed / executionStats.total) * 100) : 0}% of all
              </div>
            </div>

            <div className="p-3 bg-red-50/70 border border-red-100 rounded-lg">
              <div className="text-xs font-medium text-red-800 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-red-600" /> Failed
              </div>
              <div className="text-lg font-bold text-red-900 mt-1">{executionStats.failed}</div>
              <div className="text-[10px] text-red-700">
                {executionStats.total > 0 ? Math.round((executionStats.failed / executionStats.total) * 100) : 0}% of all
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-lg">
              <div className="text-xs font-medium text-amber-800 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-600" /> Blocked
              </div>
              <div className="text-lg font-bold text-amber-900 mt-1">{executionStats.blocked}</div>
              <div className="text-[10px] text-amber-700">
                {executionStats.total > 0 ? Math.round((executionStats.blocked / executionStats.total) * 100) : 0}% of all
              </div>
            </div>

            <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-lg">
              <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-slate-500" /> Not Run
              </div>
              <div className="text-lg font-bold text-slate-800 mt-1">{executionStats.notRun}</div>
              <div className="text-[10px] text-slate-500">
                {executionStats.total > 0 ? Math.round((executionStats.notRun / executionStats.total) * 100) : 0}% of all
              </div>
            </div>
          </div>

          {/* Active Test Runs List */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Execution Cycles</h4>
              <button
                onClick={() => setNavSection('test-runs')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                View all runs <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {projectRuns.map((run) => {
                const rPassed = run.items.filter((i) => i.status === 'passed').length;
                const rFailed = run.items.filter((i) => i.status === 'failed').length;
                const rTotal = run.items.length;
                const rPercent = rTotal > 0 ? Math.round(((rPassed + rFailed) / rTotal) * 100) : 0;

                return (
                  <div
                    key={run.id}
                    onClick={() => {
                      setSelectedTestRunId(run.id);
                      setNavSection('test-runs');
                    }}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">{run.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          {run.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                        <span>Build: {run.buildVersion}</span>
                        <span>•</span>
                        <span>{run.items.length} test cases</span>
                        <span>•</span>
                        <span className={rFailed > 0 ? 'text-red-600 font-semibold' : 'text-slate-500'}>
                          {rPassed} pass / {rFailed} fail
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${rPercent}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-8 text-right">{rPercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Recent Failures & Activity */}
        <div className="space-y-6">
          {/* Recent Failures Requiring Attention */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-500" /> Recent Failures
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                {failedRunItems.length}
              </span>
            </div>

            {failedRunItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                No active execution failures.
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {failedRunItems.map((fail, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedTestRunId(fail.runId);
                      setSelectedTestCaseId(fail.testCaseId);
                      setNavSection('test-execution');
                    }}
                    className="p-2.5 rounded-lg bg-red-50/50 border border-red-100 hover:border-red-200 cursor-pointer transition-colors"
                  >
                    <div className="font-semibold text-slate-900 line-clamp-1">{fail.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span className="font-mono text-red-700">{fail.testCaseId}</span>
                      <span>{fail.runName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Activity Stream */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" /> Activity Stream
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto text-xs divide-y divide-slate-100">
              {activityLogs
                .filter((l) => l.projectId === currentProject.id)
                .slice(0, 6)
                .map((log) => (
                  <div key={log.id} className="pt-2 first:pt-0">
                    <div className="text-slate-800">
                      <span className="font-semibold text-slate-900">{log.entityName}</span>{' '}
                      <span className="text-slate-500">{log.action}</span>
                    </div>
                    {log.details && <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{log.details}</div>}
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
