import React from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { MistakeRecord } from '../../types';

interface WeakAreasSummaryProps {
  mistakes: MistakeRecord[];
}

export const WeakAreasSummary: React.FC<WeakAreasSummaryProps> = ({ mistakes }) => {
  const unresolved = mistakes.filter(m => !m.resolved);

  if (unresolved.length === 0) {
    return (
      <div
        id="mistake-memory-summary"
        className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Zero Active Misconceptions
            </h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400">
              All detected mental traps (counting vs summing, list mutation) have been mastered in recent tests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="mistake-memory-summary"
      className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
          Active Mistake Memory ({unresolved.length} Tracked Misconceptions)
        </h4>
      </div>

      <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
        The adaptive coach cross-references these patterns to automatically schedule reinforcement exercises across Quick Think, Code Lab, and Logic Builder.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {unresolved.map(mstk => (
          <div
            key={mstk.id}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {mstk.description}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
                {mstk.occurrences}x seen
              </span>
            </div>
            {mstk.example && (
              <div className="font-mono text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded">
                {mstk.example}
              </div>
            )}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>Topic: {mstk.topic}</span>
              <span>Consecutive fixes: {mstk.consecutive_successes}/2</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
