import React, { useState } from 'react';
import { Lightbulb, ChevronRight, Lock } from 'lucide-react';

interface HintPanelProps {
  hints: string[];
  hintsRevealedCount: number;
  onRevealNextHint: () => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  hints,
  hintsRevealedCount,
  onRevealNextHint,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const tierLabels = [
    'Tier 1: Conceptual Direction',
    'Tier 2: Algorithmic Logic',
    'Tier 3: Pseudocode Structure',
    'Tier 4: Partial Code Clue',
  ];

  if (!hints || hints.length === 0) return null;

  return (
    <div
      id="progressive-hint-panel"
      className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-4 transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
            Progressive Hints ({hintsRevealedCount}/{hints.length})
          </h4>
        </div>

        {hintsRevealedCount < hints.length && (
          <button
            id="reveal-hint-button"
            onClick={() => {
              onRevealNextHint();
              setIsOpen(true);
            }}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-200/70 hover:bg-amber-200 text-amber-900 dark:bg-amber-900 dark:hover:bg-amber-800 dark:text-amber-100 transition-colors inline-flex items-center gap-1"
          >
            <span>Reveal Hint {hintsRevealedCount + 1}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* List revealed hints */}
      {hintsRevealedCount > 0 && (
        <div className="mt-3 space-y-2.5">
          {hints.slice(0, hintsRevealedCount).map((hint, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/50 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200"
            >
              <div className="font-semibold text-amber-700 dark:text-amber-400 text-[11px] mb-1">
                {tierLabels[idx] || `Hint ${idx + 1}`}
              </div>
              <p className="leading-relaxed font-sans">{hint}</p>
            </div>
          ))}
        </div>
      )}

      {hintsRevealedCount === 0 && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
          Try to reason through the problem first. If you get stuck, reveal progressive hints one level at a time.
        </p>
      )}
    </div>
  );
};
