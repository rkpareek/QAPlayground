import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  PlayCircle,
  Bug,
  FileCode,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { PriorityBadge, DefectBadge, SeverityBadge } from '../common/Badges';

export const MyWorkView: React.FC = () => {
  const {
    currentUser,
    currentProject,
    testCases,
    testRuns,
    defects,
    setSelectedTestCaseId,
    setSelectedTestRunId,
    setSelectedDefectId,
    setNavSection,
  } = useApp();

  // Filter items assigned to current user
  const myCases = testCases.filter(
    (tc) => tc.projectId === currentProject.id && tc.assigneeId === currentUser.id
  );

  const myDefects = defects.filter(
    (d) => d.projectId === currentProject.id && d.assigneeId === currentUser.id && d.status !== 'closed'
  );

  const activeRuns = testRuns.filter(
    (r) => r.projectId === currentProject.id && r.status === 'in_progress'
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">My Work & Assigned Tasks</h1>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
            {currentUser.name} ({currentUser.role})
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Your personal QA dashboard for upcoming test executions, test authoring reviews, and assigned defect triages.
        </p>
      </div>

      {/* 3 Columns for Work items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Active Test Executions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-blue-600" /> Active Test Runs ({activeRuns.length})
            </h3>
            <button
              onClick={() => setNavSection('test-runs')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {activeRuns.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No active test execution cycles in progress.</div>
            ) : (
              activeRuns.map((run) => (
                <div
                  key={run.id}
                  onClick={() => {
                    setSelectedTestRunId(run.id);
                    setNavSection('test-execution');
                  }}
                  className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-700">{run.id}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      In Progress
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 leading-snug">{run.name}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>{run.items.length} test cases</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      Execute <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Assigned Test Cases */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-purple-600" /> Assigned Test Cases ({myCases.length})
            </h3>
            <button
              onClick={() => setNavSection('repository')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Repository
            </button>
          </div>

          <div className="space-y-3">
            {myCases.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No test cases assigned to you directly.</div>
            ) : (
              myCases.map((tc) => (
                <div
                  key={tc.id}
                  onClick={() => {
                    setSelectedTestCaseId(tc.id);
                    setNavSection('repository');
                  }}
                  className="p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800">{tc.id}</span>
                    <PriorityBadge priority={tc.priority} />
                  </div>
                  <h4 className="font-semibold text-slate-900 leading-snug">{tc.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="capitalize">{tc.status}</span>
                    <span className="text-purple-600 font-semibold flex items-center gap-1">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Assigned Defects */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Bug className="w-4 h-4 text-red-600" /> Assigned Defects ({myDefects.length})
            </h3>
            <button
              onClick={() => setNavSection('defects')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Defect Board
            </button>
          </div>

          <div className="space-y-3">
            {myDefects.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No open defects assigned to you.</div>
            ) : (
              myDefects.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDefectId(d.id);
                    setNavSection('defects');
                  }}
                  className="p-3 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50/20 cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-red-900">{d.id}</span>
                    <div className="flex items-center gap-1">
                      <SeverityBadge severity={d.severity} />
                      <DefectBadge status={d.status} />
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-900 leading-snug">{d.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="capitalize">{d.status.replace('_', ' ')}</span>
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      Triage <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
