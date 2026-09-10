import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Send,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Code,
  FileText,
} from 'lucide-react';
import { GeneratedExercise, LogicEvaluationResult } from '../../types';
import { GeminiClient } from '../../services/geminiClient';
import { DifficultyBadge } from '../shared/DifficultyBadge';
import { HintPanel } from '../shared/HintPanel';

interface LogicBuilderWorkspaceProps {
  exercise: GeneratedExercise;
  onLogicEvaluated: (
    isCorrect: boolean,
    hintsUsed: number,
    attempts: number,
    evalResult: LogicEvaluationResult
  ) => void;
  onNextExercise: () => void;
}

export const LogicBuilderWorkspace: React.FC<LogicBuilderWorkspaceProps> = ({
  exercise,
  onLogicEvaluated,
  onNextExercise,
}) => {
  const [explanation, setExplanation] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<LogicEvaluationResult | null>(null);
  const [attempts, setAttempts] = useState(1);
  const [showCodeTranslation, setShowCodeTranslation] = useState(false);

  useEffect(() => {
    setExplanation('');
    setHintsRevealed(0);
    setEvaluation(null);
    setAttempts(1);
    setShowCodeTranslation(false);
  }, [exercise.id]);

  const handleSubmit = async () => {
    if (!explanation.trim() || isEvaluating) return;
    setIsEvaluating(true);
    try {
      const evalRes = await GeminiClient.evaluateLogic(exercise, explanation);
      setEvaluation(evalRes);
      onLogicEvaluated(
        evalRes.status === 'correct',
        hintsRevealed,
        attempts,
        evalRes
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetry = () => {
    setEvaluation(null);
    setAttempts(prev => prev + 1);
  };

  return (
    <div id="logic-builder-workspace" className="max-w-4xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {exercise.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Algorithmic Thinking in Plain English (No Code First)</span>
            </div>
          </div>
        </div>

        <DifficultyBadge level={exercise.difficulty} />
      </div>

      {/* Challenge Description */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
            Algorithmic Problem
          </span>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
            {exercise.question}
          </p>
        </div>

        {/* English Rubric Guidance Box */}
        <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-200 space-y-1">
          <div className="font-bold">What a strong English algorithm includes:</div>
          <ul className="list-disc list-inside space-y-0.5 opacity-90">
            <li>State: What variables do you initialize and remember before iterating?</li>
            <li>Condition: Exactly what boolean comparison triggers an update?</li>
            <li>Transition: How do the variables shift when the condition holds?</li>
            <li>Edge cases: How are empty lists, duplicates, or single items handled?</li>
          </ul>
        </div>
      </div>

      {/* Progressive Hints */}
      <HintPanel
        hints={exercise.hints}
        hintsRevealedCount={hintsRevealed}
        onRevealNextHint={() => setHintsRevealed(prev => prev + 1)}
      />

      {/* English Explanation Input Area */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Your English Algorithmic Solution:
        </label>
        <textarea
          id="logic-builder-textarea"
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          disabled={!!evaluation && evaluation.status === 'correct'}
          rows={6}
          placeholder="First, I initialize two variables: largest and second_largest to negative infinity... Then I iterate through each number..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm leading-relaxed text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
        />

        {!evaluation && (
          <div className="flex justify-end pt-1">
            <button
              id="logic-builder-submit-btn"
              onClick={handleSubmit}
              disabled={isEvaluating || !explanation.trim()}
              className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEvaluating ? 'Evaluating Algorithm...' : 'Submit English Logic'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Rubric Evaluation Results */}
      {evaluation && (
        <div
          id="logic-builder-evaluation-card"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {evaluation.status === 'correct' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {evaluation.status === 'correct'
                  ? 'Algorithmic Reasoning Approved'
                  : 'Needs Reasoning Refinement'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              Score: {evaluation.score}/100
            </span>
          </div>

          {/* 4-factor rubric breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">State</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {evaluation.state_tracking_score}%
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                Conditions
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {evaluation.conditions_score}%
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                Transitions
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {evaluation.transitions_score}%
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                Edge Cases
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {evaluation.edge_case_score}%
              </span>
            </div>
          </div>

          {/* Critique text */}
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {evaluation.critique}
          </p>

          {/* Optional Code Translation view */}
          {evaluation.status === 'correct' && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button
                id="toggle-code-translation-btn"
                onClick={() => setShowCodeTranslation(!showCodeTranslation)}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5" />
                <span>
                  {showCodeTranslation
                    ? 'Hide Python Translation'
                    : 'View Translated Pseudocode & Python Implementation'}
                </span>
              </button>

              {showCodeTranslation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 font-mono text-xs">
                  {evaluation.optional_pseudocode && (
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block mb-1">
                        Pseudocode:
                      </span>
                      <pre className="whitespace-pre-wrap">{evaluation.optional_pseudocode}</pre>
                    </div>
                  )}
                  {evaluation.optional_python_translation && (
                    <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block mb-1">
                        Python:
                      </span>
                      <pre className="whitespace-pre-wrap">
                        {evaluation.optional_python_translation}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-3 flex items-center justify-between">
            {evaluation.status !== 'correct' ? (
              <button
                id="logic-retry-btn"
                onClick={handleRetry}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refine Reasoning</span>
              </button>
            ) : (
              <div />
            )}

            {evaluation.status === 'correct' && (
              <button
                id="logic-next-exercise-btn"
                onClick={onNextExercise}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Next Algorithmic Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
