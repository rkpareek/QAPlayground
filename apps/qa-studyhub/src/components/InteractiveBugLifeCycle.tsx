import React, { useState } from 'react';
import { BUG_LIFECYCLE_STATES } from '../data/manualTesting';
import { ArrowRight, Info, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const InteractiveBugLifeCycle: React.FC = () => {
  const [activeState, setActiveState] = useState<string>('New');

  const mainFlow = ['New', 'Assigned', 'Open', 'Fixed', 'Pending Retest', 'Verified', 'Closed'];
  const altStates = ['Reopened', 'Rejected', 'Duplicate', 'Deferred'];

  const currentStateInfo = BUG_LIFECYCLE_STATES.find((s) => s.state === activeState) || BUG_LIFECYCLE_STATES[0];

  return (
    <div id="interactive-bug-lifecycle" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs my-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <h4 className="font-bold text-slate-900 text-base">Interactive Bug Life Cycle Visualizer</h4>
          <p className="text-xs text-slate-500">Click any status node to understand what happens and who takes action.</p>
        </div>
        <button
          onClick={() => setActiveState('New')}
          className="text-xs flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Flow
        </button>
      </div>

      {/* Main Happy Path Flow */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Standard Happy Path Flow:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {mainFlow.map((st, idx) => {
            const isSelected = activeState === st;
            return (
              <React.Fragment key={st}>
                <button
                  id={`bug-state-btn-${st.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setActiveState(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}. {st}
                </button>
                {idx < mainFlow.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Alternative Exception States */}
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Alternative / Exception Statuses:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {altStates.map((st) => {
            const isSelected = activeState === st;
            return (
              <button
                key={st}
                id={`bug-alt-state-btn-${st.toLowerCase()}`}
                onClick={() => setActiveState(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Box for Selected State */}
      <div className={`p-4 rounded-xl border ${currentStateInfo.color} transition-all`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Active State: {currentStateInfo.state}</span>
          </div>
          <span className="text-[11px] font-mono opacity-75">
            {mainFlow.includes(currentStateInfo.state) ? 'Main Lifecycle' : 'Exception State'}
          </span>
        </div>
        <p className="text-xs mt-2 leading-relaxed opacity-90">
          {currentStateInfo.description}
        </p>

        {/* Action Guidance */}
        <div className="mt-3 pt-3 border-t border-current/20 text-xs flex flex-wrap items-center justify-between gap-2">
          {currentStateInfo.state === 'New' && (
            <span><strong>QA Responsibility:</strong> Ensure bug report has clear steps, screenshots, build number, and test data.</span>
          )}
          {currentStateInfo.state === 'Assigned' && (
            <span><strong>Dev Lead Responsibility:</strong> Review bug validity and route to the module developer.</span>
          )}
          {currentStateInfo.state === 'Open' && (
            <span><strong>Developer Responsibility:</strong> Reproduce defect locally, inspect logs, and write code fix.</span>
          )}
          {currentStateInfo.state === 'Fixed' && (
            <span><strong>Developer Responsibility:</strong> Commit code, attach unit test, and trigger staging build.</span>
          )}
          {currentStateInfo.state === 'Pending Retest' && (
            <span><strong>QA Responsibility:</strong> Retest failed test cases on the newly deployed staging build.</span>
          )}
          {currentStateInfo.state === 'Verified' && (
            <span><strong>QA Responsibility:</strong> Confirm defect no longer reproduces; check adjacent modules for regressions.</span>
          )}
          {currentStateInfo.state === 'Closed' && (
            <span><strong>QA Responsibility:</strong> Formally close Jira ticket with retest evidence.</span>
          )}
          {currentStateInfo.state === 'Reopened' && (
            <span><strong>QA Responsibility:</strong> Bug still reproduces; add updated notes/video and reassign to developer.</span>
          )}
          {currentStateInfo.state === 'Rejected' && (
            <span><strong>Triage:</strong> Developer/PO clarifies requirement matches intended specification.</span>
          )}
          {currentStateInfo.state === 'Deferred' && (
            <span><strong>Product Owner:</strong> Low urgency bug postponed to next milestone or future release.</span>
          )}
          {currentStateInfo.state === 'Duplicate' && (
            <span><strong>QA/Dev:</strong> Ticket linked to existing master bug ID and closed.</span>
          )}
        </div>
      </div>
    </div>
  );
};
