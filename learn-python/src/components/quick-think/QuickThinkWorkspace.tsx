import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  Send,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { GeneratedExercise, EvaluationResult, LearningModeId } from '../../types';
import { GeminiClient } from '../../services/geminiClient';
import { DifficultyBadge } from '../shared/DifficultyBadge';
import { EvaluationPanel } from '../shared/EvaluationPanel';

interface QuickThinkWorkspaceProps {
  exercise: GeneratedExercise;
  onAnswerSubmitted: (
    isCorrect: boolean,
    hintsUsed: number,
    attempts: number,
    evalResult: EvaluationResult
  ) => void;
  onNextExercise: () => void;
  isLoadingNew: boolean;
}

export const QuickThinkWorkspace: React.FC<QuickThinkWorkspaceProps> = ({
  exercise,
  onAnswerSubmitted,
  onNextExercise,
  isLoadingNew,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [freeformAnswer, setFreeformAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [attempts, setAttempts] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedOption(null);
    setFreeformAnswer('');
    setEvaluation(null);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setAttempts(1);
    setHintsUsed(0);
  }, [exercise.id]);

  // Optional practice timer
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !evaluation) {
      interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, evaluation]);

  // Keyboard shortcut listener for options 1-4 & Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (evaluation || isEvaluating) return;

      if (exercise.options) {
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= exercise.options.length) {
          setSelectedOption(keyNum - 1);
        }
      }

      if (e.key === 'Enter' && (selectedOption !== null || freeformAnswer.trim())) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, freeformAnswer, evaluation, isEvaluating, exercise]);

  const handleSubmit = async () => {
    if (evaluation || isEvaluating) return;
    const answer =
      selectedOption !== null ? selectedOption.toString() : freeformAnswer.trim();
    if (!answer) return;

    setIsEvaluating(true);
    try {
      const evalResult = await GeminiClient.evaluateAnswer(exercise, answer);
      setEvaluation(evalResult);
      setIsTimerRunning(false);
      onAnswerSubmitted(
        evalResult.status === 'correct',
        hintsUsed,
        attempts,
        evalResult
      );
    } catch {
      // fallback
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetry = () => {
    setEvaluation(null);
    setSelectedOption(null);
    setFreeformAnswer('');
    setAttempts(prev => prev + 1);
    setIsTimerRunning(true);
  };

  const handleRequestHint = () => {
    setHintsUsed(prev => prev + 1);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id="quick-think-workspace" className="max-w-4xl mx-auto space-y-6">
      {/* Exercise Metadata Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {exercise.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="capitalize">Topic: {exercise.topic.replace('-', ' ')}</span>
              <span>•</span>
              <span>Concepts: {exercise.expected_concepts.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(timerSeconds)}</span>
          </div>
          <DifficultyBadge level={exercise.difficulty} />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
        {/* Question Prompt */}
        <p className="text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans">
          {exercise.question}
        </p>

        {/* Code Snippet Box (if provided) */}
        {exercise.code_snippet && (
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs text-slate-200 shadow-inner">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <span>Python 3.12</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Predict Output</span>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed text-emerald-400 font-mono whitespace-pre">
              {exercise.code_snippet}
            </pre>
          </div>
        )}

        {/* Interactive Options or Freeform Input */}
        {exercise.options ? (
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Select the correct outcome:</span>
              <span className="text-[11px] font-normal lowercase opacity-70">
                Press 1-{exercise.options.length} or click
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exercise.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    id={`quick-think-opt-${idx}`}
                    onClick={() => !evaluation && setSelectedOption(idx)}
                    disabled={!!evaluation}
                    className={`p-3.5 rounded-xl border text-left text-xs font-medium font-mono transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Type your predicted output:
            </label>
            <input
              id="quick-think-freeform-input"
              type="text"
              value={freeformAnswer}
              onChange={e => setFreeformAnswer(e.target.value)}
              disabled={!!evaluation}
              placeholder="e.g. [1, 2, 3]"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        {/* Submit action */}
        {!evaluation && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {hintsUsed > 0 ? `${hintsUsed} hint(s) consulted` : 'No hints consulted'}
            </span>

            <button
              id="quick-think-submit-btn"
              onClick={handleSubmit}
              disabled={isEvaluating || (selectedOption === null && !freeformAnswer.trim())}
              className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isEvaluating ? (
                <span>Evaluating reasoning...</span>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Evaluation Result Feedback */}
      {evaluation && (
        <EvaluationPanel
          evaluation={evaluation}
          onRetry={handleRetry}
          onNext={onNextExercise}
          onRequestHint={handleRequestHint}
          canRequestHint={hintsUsed < exercise.hints.length}
        />
      )}
    </div>
  );
};
