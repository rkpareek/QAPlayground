import React, { useState } from 'react';
import { AlertCircle, Zap, ShieldAlert, Check } from 'lucide-react';

export const InteractiveSeverityPriority: React.FC = () => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<number>(0);

  const quadrants = [
    {
      title: 'High Severity / High Priority (P1 / Critical)',
      tag: 'Critical Blocker',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      scenario: 'Application crashes immediately whenever any user clicks "Pay with Credit Card" on the checkout page.',
      whySeverity: 'Severity is HIGH because core financial transactions are completely broken with no workaround.',
      whyPriority: 'Priority is HIGH because direct business revenue is blocked immediately; requires instant fix within hours.',
      action: 'Drop everything, alert engineering manager, release hotfix ASAP.'
    },
    {
      title: 'High Severity / Low Priority (P3 / Major)',
      tag: 'Edge-case Crash',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
      scenario: 'Application crashes when generating an annual tax export report specifically for users on Windows 7 with Italian locale.',
      whySeverity: 'Severity is HIGH because the application crashes with a fatal error.',
      whyPriority: 'Priority is LOW because less than 0.05% of users encounter this legacy condition; report can be generated manually by support.',
      action: 'Schedule fix for next sprint release.'
    },
    {
      title: 'Low Severity / High Priority (P1 / Minor)',
      tag: 'Urgent Brand/Logo Issue',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      scenario: 'Company brand name is misspelled on the public homepage header banner ("Amazn" instead of "Amazon") or CEO name is incorrect.',
      whySeverity: 'Severity is LOW because zero functionality is broken; users can still browse and shop seamlessly.',
      whyPriority: 'Priority is HIGH because it severely damages company reputation and public brand credibility.',
      action: 'Fix HTML/copy and deploy immediately.'
    },
    {
      title: 'Low Severity / Low Priority (P4 / Trivial)',
      tag: 'Cosmetic / Backlog',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
      scenario: 'A subtle tooltip text in the profile settings tab has a minor punctuation typo or is misaligned by 2 pixels.',
      whySeverity: 'Severity is LOW because system operates completely normally.',
      whyPriority: 'Priority is LOW because users barely notice and it does not block any workflow.',
      action: 'Add to low-priority UI polish backlog.'
    }
  ];

  const current = quadrants[selectedQuadrant];

  return (
    <div id="interactive-severity-priority" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs my-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-base">Interactive Severity vs Priority 2×2 Matrix</h4>
          <p className="text-xs text-slate-500">Understand the real-world difference between technical impact (Severity) and business urgency (Priority).</p>
        </div>
      </div>

      {/* 2x2 Matrix Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {quadrants.map((q, idx) => {
          const isSelected = selectedQuadrant === idx;
          return (
            <button
              key={idx}
              id={`sev-prio-quadrant-${idx}`}
              onClick={() => setSelectedQuadrant(idx)}
              className={`p-3.5 rounded-xl text-left border transition-all relative ${
                isSelected
                  ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-400/30'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-bold text-xs text-slate-900">{q.title}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${q.badgeClass}`}>
                  {q.tag}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {q.scenario}
              </p>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Analysis for Selected Quadrant */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
          <span className="font-bold text-sm text-purple-300">{current.title}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-purple-900/50 text-purple-200 border border-purple-700">
            {current.tag}
          </span>
        </div>

        <div className="text-xs space-y-2.5 leading-relaxed text-slate-300">
          <div>
            <strong className="text-white">Example Scenario:</strong> {current.scenario}
          </div>
          <div>
            <strong className="text-rose-400">Why Severity:</strong> {current.whySeverity}
          </div>
          <div>
            <strong className="text-amber-400">Why Priority:</strong> {current.whyPriority}
          </div>
          <div className="pt-2 border-t border-slate-800 text-emerald-400">
            <strong>Recommended QA/Dev Action:</strong> {current.action}
          </div>
        </div>
      </div>
    </div>
  );
};
