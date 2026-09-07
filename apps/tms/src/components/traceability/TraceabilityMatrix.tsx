import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ExecutionStatus } from '../../types';
import {
  ShieldCheck,
  Download,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  CircleDot,
  Bug,
  FileCode,
  ListTodo,
  ExternalLink,
} from 'lucide-react';
import { PriorityBadge, ExecutionBadge, StatusBadge } from '../common/Badges';

export const TraceabilityMatrix: React.FC = () => {
  const {
    currentProject,
    requirements,
    testCases,
    testRuns,
    defects,
    setSelectedTestCaseId,
    setSelectedDefectId,
    setSelectedRequirementId,
    setNavSection,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [coverageFilter, setCoverageFilter] = useState<string>('all');

  // Build matrix rows
  const matrixRows = useMemo(() => {
    const projectReqs = requirements.filter((r) => r.projectId === currentProject.id);

    return projectReqs.map((req) => {
      // Find mapped test cases
      const mappedCases = testCases.filter(
        (tc) =>
          tc.projectId === currentProject.id &&
          (tc.linkedRequirementIds?.includes(req.id) || req.linkedTestCaseIds?.includes(tc.id))
      );

      // Aggregate execution statuses for these test cases across all test runs
      const caseExecutions = mappedCases.map((tc) => {
        // Find latest execution for this test case
        let latestStatus: ExecutionStatus = 'not_run';
        let latestRunId = '';

        for (const run of testRuns.filter((r) => r.projectId === currentProject.id)) {
          const item = run.items.find((it) => it.testCaseId === tc.id);
          if (item && item.status !== 'not_run') {
            latestStatus = item.status;
            latestRunId = run.id;
            break;
          }
        }

        // Linked defects for this test case
        const caseDefects = defects.filter(
          (d) => d.linkedTestCaseId === tc.id || d.linkedRequirementId === req.id
        );

        return {
          testCase: tc,
          latestStatus,
          latestRunId,
          defects: caseDefects,
        };
      });

      // Overall health calculation
      let health: 'verified' | 'failed' | 'blocked' | 'in_progress' | 'uncovered' = 'uncovered';
      if (mappedCases.length === 0) {
        health = 'uncovered';
      } else {
        const hasFail = caseExecutions.some((ce) => ce.latestStatus === 'failed');
        const hasBlock = caseExecutions.some((ce) => ce.latestStatus === 'blocked');
        const allPassed = caseExecutions.every((ce) => ce.latestStatus === 'passed');

        if (hasFail) health = 'failed';
        else if (hasBlock) health = 'blocked';
        else if (allPassed) health = 'verified';
        else health = 'in_progress';
      }

      return {
        requirement: req,
        caseExecutions,
        health,
      };
    });
  }, [requirements, testCases, testRuns, defects, currentProject.id]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return matrixRows.filter((row) => {
      if (coverageFilter !== 'all' && row.health !== coverageFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const rMatch =
          row.requirement.id.toLowerCase().includes(q) ||
          row.requirement.title.toLowerCase().includes(q);
        const cMatch = row.caseExecutions.some((ce) =>
          ce.testCase.title.toLowerCase().includes(q) || ce.testCase.id.toLowerCase().includes(q)
        );
        if (!rMatch && !cMatch) return false;
      }
      return true;
    });
  }, [matrixRows, coverageFilter, searchQuery]);

  // Health summary metrics
  const summary = useMemo(() => {
    const total = matrixRows.length;
    const verified = matrixRows.filter((r) => r.health === 'verified').length;
    const failed = matrixRows.filter((r) => r.health === 'failed').length;
    const uncovered = matrixRows.filter((r) => r.health === 'uncovered').length;
    const inProgress = matrixRows.filter((r) => r.health === 'in_progress' || r.health === 'blocked').length;

    const coverageRate = total > 0 ? Math.round(((total - uncovered) / total) * 100) : 0;
    const verifiedRate = total > 0 ? Math.round((verified / total) * 100) : 0;

    return { total, verified, failed, uncovered, inProgress, coverageRate, verifiedRate };
  }, [matrixRows]);

  const handleExportCsv = () => {
    let csv = 'Requirement ID,Requirement Title,Priority,Test Case ID,Test Title,Latest Status,Linked Defects,Coverage Health\n';
    matrixRows.forEach((row) => {
      if (row.caseExecutions.length === 0) {
        csv += `"${row.requirement.id}","${row.requirement.title}","${row.requirement.priority}","N/A","N/A","N/A","N/A","${row.health}"\n`;
      } else {
        row.caseExecutions.forEach((ce) => {
          const defStr = ce.defects.map((d) => d.id).join(';');
          csv += `"${row.requirement.id}","${row.requirement.title}","${row.requirement.priority}","${ce.testCase.id}","${ce.testCase.title}","${ce.latestStatus}","${defStr}","${row.health}"\n`;
        });
      }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentProject.key}_Traceability_Matrix.csv`;
    link.click();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Requirements Traceability Matrix (RTM)</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
              {summary.coverageRate}% Test Coverage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end verification mapping: Requirements → Test Specifications → Execution Runs → Defects.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Matrix CSV</span>
        </button>
      </div>

      {/* Summary Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium">Requirements Total</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{summary.total}</div>
          <div className="text-[11px] text-slate-500 mt-1">100% of defined scope</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-emerald-800 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fully Verified
          </span>
          <div className="text-2xl font-bold text-emerald-900 mt-1">{summary.verified}</div>
          <div className="text-[11px] text-emerald-700 mt-1">{summary.verifiedRate}% pass verified</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs">
          <span className="text-red-800 font-medium flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-600" /> Failed / Broken
          </span>
          <div className="text-2xl font-bold text-red-900 mt-1">{summary.failed}</div>
          <div className="text-[11px] text-red-700 mt-1">Requires immediate QA review</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <span className="text-amber-800 font-medium flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-600" /> Uncovered Specs
          </span>
          <div className="text-2xl font-bold text-amber-900 mt-1">{summary.uncovered}</div>
          <div className="text-[11px] text-amber-700 mt-1">No test cases assigned</div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search matrix by requirement, test case title, or defect..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-xs outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={coverageFilter}
            onChange={(e) => setCoverageFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs bg-slate-50"
          >
            <option value="all">All Coverage Health</option>
            <option value="verified">Fully Verified</option>
            <option value="failed">Failed / Broken</option>
            <option value="in_progress">In Progress / Blocked</option>
            <option value="uncovered">Uncovered</option>
          </select>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3 w-1/4">Requirement Specification</th>
              <th className="p-3 w-1/3">Mapped Test Cases</th>
              <th className="p-3 w-28 text-center">Execution Status</th>
              <th className="p-3 w-1/5">Linked Defects</th>
              <th className="p-3 w-28 text-right">Coverage Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row) => (
              <tr key={row.requirement.id} className="hover:bg-slate-50/70 transition-colors">
                {/* 1. Requirement Spec */}
                <td className="p-3 align-top">
                  <div
                    onClick={() => {
                      setSelectedRequirementId(row.requirement.id);
                      setNavSection('requirements');
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-blue-600">
                        {row.requirement.id}
                      </span>
                      <PriorityBadge priority={row.requirement.priority} />
                    </div>
                    <div className="font-semibold text-slate-800 mt-1 leading-snug group-hover:text-blue-600">
                      {row.requirement.title}
                    </div>
                  </div>
                </td>

                {/* 2. Mapped Test Cases */}
                <td className="p-3 align-top">
                  {row.caseExecutions.length === 0 ? (
                    <span className="text-amber-600 font-medium italic text-[11px]">
                      ⚠️ No test cases mapped
                    </span>
                  ) : (
                    <div className="space-y-1.5">
                      {row.caseExecutions.map((ce) => (
                        <div
                          key={ce.testCase.id}
                          onClick={() => {
                            setSelectedTestCaseId(ce.testCase.id);
                            setNavSection('repository');
                          }}
                          className="flex items-center justify-between p-1.5 rounded bg-slate-50 hover:bg-blue-50/60 border border-slate-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="font-mono font-bold text-slate-700 shrink-0">{ce.testCase.id}</span>
                            <span className="truncate text-slate-900">{ce.testCase.title}</span>
                          </div>
                          <ExecutionBadge status={ce.latestStatus} />
                        </div>
                      ))}
                    </div>
                  )}
                </td>

                {/* 3. Aggregated Execution */}
                <td className="p-3 align-top text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono font-bold text-slate-800">
                      {row.caseExecutions.filter((c) => c.latestStatus === 'passed').length} / {row.caseExecutions.length}
                    </span>
                    <span className="text-[10px] text-slate-400">Passed / Total</span>
                  </div>
                </td>

                {/* 4. Linked Defects */}
                <td className="p-3 align-top">
                  {row.caseExecutions.flatMap((c) => c.defects).length === 0 ? (
                    <span className="text-slate-400 italic text-[11px]">None</span>
                  ) : (
                    <div className="space-y-1">
                      {row.caseExecutions
                        .flatMap((c) => c.defects)
                        .filter((def, index, self) => index === self.findIndex((d) => d.id === def.id))
                        .map((d) => (
                          <div
                            key={d.id}
                            onClick={() => {
                              setSelectedDefectId(d.id);
                              setNavSection('defects');
                            }}
                            className="p-1 px-2 rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 flex items-center justify-between cursor-pointer"
                          >
                            <span className="font-mono font-bold text-[11px]">{d.id}</span>
                            <span className="text-[10px] uppercase font-bold">{d.severity}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </td>

                {/* 5. Health Status */}
                <td className="p-3 align-top text-right">
                  {row.health === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                    </span>
                  )}
                  {row.health === 'failed' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                      <XCircle className="w-3.5 h-3.5 text-red-600" /> Failed
                    </span>
                  )}
                  {row.health === 'blocked' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-600" /> Blocked
                    </span>
                  )}
                  {row.health === 'in_progress' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      <CircleDot className="w-3.5 h-3.5 text-blue-600" /> In Progress
                    </span>
                  )}
                  {row.health === 'uncovered' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                      Uncovered
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
