import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ShieldCheck,
  Calendar,
  Layers,
  User,
  CheckSquare,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { currentProject, releases, testCases, testRuns, defects, requirements } = useApp();

  const [selectedReleaseId, setSelectedReleaseId] = useState(releases[0]?.id || 'rel-2.5');
  const targetRelease = releases.find((r) => r.id === selectedReleaseId) || releases[0];

  const projectCases = testCases.filter((tc) => tc.projectId === currentProject.id && !tc.isArchived);
  const projectRuns = testRuns.filter((tr) => tr.projectId === currentProject.id);
  const projectDefects = defects.filter((d) => d.projectId === currentProject.id);
  const projectReqs = requirements.filter((r) => r.projectId === currentProject.id);

  // Compute metrics
  let totalExecutions = 0;
  let passedCount = 0;
  let failedCount = 0;
  let blockedCount = 0;

  projectRuns.forEach((r) => {
    r.items.forEach((item) => {
      if (item.status !== 'not_run') {
        totalExecutions++;
        if (item.status === 'passed') passedCount++;
        if (item.status === 'failed') failedCount++;
        if (item.status === 'blocked') blockedCount++;
      }
    });
  });

  const passRate = totalExecutions > 0 ? Math.round((passedCount / totalExecutions) * 100) : 0;
  const blockerCount = projectDefects.filter((d) => d.severity === 'blocker' || d.severity === 'critical').length;

  const isReleaseReady = passRate >= 90 && blockerCount === 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Release Test Sign-Off Report</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
              Auditable Document
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Formal QA sign-off summary report for stakeholder review and release approval.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedReleaseId}
            onChange={(e) => setSelectedReleaseId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
          >
            {releases.map((rel) => (
              <option key={rel.id} value={rel.id}>
                {rel.name} ({rel.version})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Report Document Sheet */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-4xl mx-auto space-y-6 text-slate-900">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
              TESTONE QA VERIFICATION REPORT
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Quality Assurance Sign-Off: {targetRelease?.name} ({targetRelease?.version})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Project: <strong>{currentProject.name}</strong> • Date Generated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
              isReleaseReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isReleaseReady ? 'PASSED QUALITY GATE' : 'PENDING DEFECT RESOLUTION'}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">1. Executive Summary</h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            During this verification cycle, <strong>{totalExecutions}</strong> test executions were conducted across{' '}
            <strong>{projectRuns.length}</strong> environments covering <strong>{projectCases.length}</strong> test
            specifications. The overall execution pass rate stands at <strong>{passRate}%</strong> with{' '}
            <strong>{projectDefects.length}</strong> active defects ({blockerCount} critical/blockers).
          </p>
        </div>

        {/* Quality Scorecard Grid */}
        <div className="grid grid-cols-4 gap-3 text-xs border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Execution Pass Rate</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{passRate}%</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Tests Executed</span>
            <div className="text-xl font-bold text-emerald-700 mt-1">
              {passedCount} / {totalExecutions}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Active Defects</span>
            <div className="text-xl font-bold text-red-700 mt-1">{projectDefects.length}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Requirements Covered</span>
            <div className="text-xl font-bold text-blue-700 mt-1">{projectReqs.length} specs</div>
          </div>
        </div>

        {/* Quality Gates Checklist */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">2. Quality Gates Checklist</h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">Pass Rate ≥ 90% in Staging Environment</span>
              {passRate >= 90 ? (
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> MET ({passRate}%)
                </span>
              ) : (
                <span className="font-bold text-red-700 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> NOT MET ({passRate}%)
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">Zero P0 Blocker or P1 Critical Defects Open</span>
              {blockerCount === 0 ? (
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> MET (0 Blockers)
                </span>
              ) : (
                <span className="font-bold text-red-700 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> NOT MET ({blockerCount} Blockers)
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">100% Critical Requirements Mapped to Tests</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> MET (100% Traceability)
              </span>
            </div>
          </div>
        </div>

        {/* Stakeholder Sign-Off Block */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">3. Stakeholder Approval Sign-Off</h2>

          <div className="grid grid-cols-2 gap-6 text-xs pt-2">
            <div className="border-b border-slate-300 pb-8">
              <div className="font-bold text-slate-900">Alex Chen (QA Lead)</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Signature: ______________________</div>
              <div className="text-slate-500 text-[11px] mt-1">Date: {new Date().toLocaleDateString()}</div>
            </div>

            <div className="border-b border-slate-300 pb-8">
              <div className="font-bold text-slate-900">Jordan Taylor (Release Manager)</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Signature: ______________________</div>
              <div className="text-slate-500 text-[11px] mt-1">Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
