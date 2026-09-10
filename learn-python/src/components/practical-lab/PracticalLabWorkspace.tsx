import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Play,
  CheckCircle2,
  AlertCircle,
  Terminal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { GeneratedExercise, CodeEvaluationResult, ExecutionResult } from '../../types';
import { PythonRunner } from '../../engine/pythonRunner';
import { GeminiClient } from '../../services/geminiClient';
import { DifficultyBadge } from '../shared/DifficultyBadge';
import { HintPanel } from '../shared/HintPanel';
import { EvaluationPanel } from '../shared/EvaluationPanel';

interface PracticalLabWorkspaceProps {
  exercise: GeneratedExercise;
  onCodeEvaluated: (
    isCorrect: boolean,
    hintsUsed: number,
    attempts: number,
    evalResult: CodeEvaluationResult
  ) => void;
  onNextExercise: () => void;
}

export const PracticalLabWorkspace: React.FC<PracticalLabWorkspaceProps> = ({
  exercise,
  onCodeEvaluated,
  onNextExercise,
}) => {
  const [code, setCode] = useState(
    exercise.starter_code || `# ${exercise.title}\n\n`
  );
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [evaluation, setEvaluation] = useState<CodeEvaluationResult | null>(null);
  const [attempts, setAttempts] = useState(1);

  useEffect(() => {
    setCode(exercise.starter_code || `# ${exercise.title}\n\n`);
    setHintsRevealed(0);
    setExecutionResult(null);
    setEvaluation(null);
    setAttempts(1);
  }, [exercise.id]);

  const handleRun = async () => {
    setIsExecuting(true);
    try {
      const res = await PythonRunner.executeCode(code, exercise.test_cases);
      setExecutionResult(res);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    let runRes = executionResult;
    if (!runRes) {
      runRes = await PythonRunner.executeCode(code, exercise.test_cases);
      setExecutionResult(runRes);
    }

    try {
      const evalRes = await GeminiClient.evaluateCode(
        exercise,
        code,
        runRes.output,
        runRes.error
      );
      setEvaluation(evalRes);
      onCodeEvaluated(
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
    <div id="practical-lab-workspace" className="max-w-5xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {exercise.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Real-World Applied WAP</span>
              <span>•</span>
              <span className="capitalize">Topic: {exercise.topic.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        <DifficultyBadge level={exercise.difficulty} />
      </div>

      {/* Scenario & Instructions */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
            Real-World Task
          </span>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
            {exercise.question}
          </p>
        </div>

        {exercise.expected_output && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Expected Output:
            </span>
            <pre className="font-mono text-emerald-600 dark:text-emerald-400">
              {exercise.expected_output}
            </pre>
          </div>
        )}
      </div>

      {/* Progressive Hints */}
      <HintPanel
        hints={exercise.hints}
        hintsRevealedCount={hintsRevealed}
        onRevealNextHint={() => setHintsRevealed(prev => prev + 1)}
      />

      {/* Code Editor */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
            solution.py
          </span>
          <div className="flex items-center gap-2">
            <button
              id="practical-run-btn"
              onClick={handleRun}
              disabled={isExecuting}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-amber-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-500 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isExecuting ? 'Running...' : 'Run'}</span>
            </button>
            <button
              id="practical-evaluate-btn"
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isEvaluating ? 'Evaluating...' : 'Submit WAP'}</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-4">
          <textarea
            id="practical-editor-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            rows={10}
            className="w-full font-mono text-xs leading-relaxed text-amber-300 bg-transparent border-none resize-y focus:outline-hidden"
          />
        </div>
      </div>

      {/* Console Output */}
      {executionResult && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Output:</span>
          <pre className="whitespace-pre-wrap">{executionResult.output || '(none)'}</pre>
          {executionResult.error && (
            <div className="text-rose-400 mt-2">{executionResult.error}</div>
          )}
        </div>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <EvaluationPanel
          evaluation={evaluation}
          onRetry={handleRetry}
          onNext={onNextExercise}
        />
      )}
    </div>
  );
};
