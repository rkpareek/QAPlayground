import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { CodeEvaluationResult, EvaluationResult } from '../../types';

interface EvaluationPanelProps {
  evaluation: EvaluationResult | CodeEvaluationResult;
  onRetry: () => void;
  onNext: () => void;
  onRequestHint?: () => void;
  canRequestHint?: boolean;
}

export const EvaluationPanel: React.FC<EvaluationPanelProps> = ({
  evaluation,
  onRetry,
  onNext,
  onRequestHint,
  canRequestHint = true,
}) => {
  const [expanded, setExpanded] = useState(true);

  const isCodeEval = 'logic_score' in evaluation;
  const codeEval = isCodeEval ? (evaluation as CodeEvaluationResult) : null;

  const isCorrect = evaluation.status === 'correct';
  const isPartial = evaluation.status === 'partial';

  const headerBg = isCorrect
    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
    : isPartial
    ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
    : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200';

  return (
    <div
      id="evaluation-result-panel"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all"
    >
      {/* Top Banner */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${headerBg} cursor-pointer select-none`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5">
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : isPartial ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <div>
            <h4 className="text-sm font-bold tracking-tight">
              {isCorrect
                ? 'Correct & Verified'
                : isPartial
                ? 'Partially Correct'
                : 'Needs Improvement'}
            </h4>
            <p className="text-xs opacity-80">Score: {Math.round(evaluation.score)} / 100</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronUp className="w-4 h-4 opacity-70" />
          ) : (
            <ChevronDown className="w-4 h-4 opacity-70" />
          )}
        </div>
      </div>

      {/* Body Content */}
      {expanded && (
        <div className="p-4 space-y-4 text-sm">
          {/* Main feedback critique */}
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {isCodeEval ? codeEval?.explanation : (evaluation as EvaluationResult).feedback}
          </div>

          {/* If code evaluation, show breakdown */}
          {codeEval && (
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-center">
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Logic
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {codeEval.logic_score}%
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Quality
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {codeEval.code_quality_score}%
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Edge Cases
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {codeEval.edge_case_score}%
                </span>
              </div>
            </div>
          )}

          {/* Strengths / Issues bullet items */}
          {codeEval && (
            <div className="space-y-1.5 text-xs">
              {codeEval.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-400">
                  <span className="font-bold">✓</span>
                  <span>{s}</span>
                </div>
              ))}
              {codeEval.issues.map((iss, i) => (
                <div key={i} className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                  <span className="font-bold">⚠</span>
                  <span>{iss}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              {!isCorrect && canRequestHint && onRequestHint && (
                <button
                  id="evaluation-need-hint-btn"
                  onClick={onRequestHint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Need a Hint</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isCorrect ? (
                <button
                  id="evaluation-try-again-btn"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              ) : (
                <button
                  id="evaluation-next-exercise-btn"
                  onClick={onNext}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <span>Next Exercise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
