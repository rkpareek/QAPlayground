import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  Save,
  RotateCcw,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Cpu,
} from 'lucide-react';
import {
  GeneratedExercise,
  CodeEvaluationResult,
  ExecutionResult,
} from '../../types';
import { PythonRunner } from '../../engine/pythonRunner';
import { GeminiClient } from '../../services/geminiClient';
import { ProfileManager } from '../../engine/profileManager';
import { DifficultyBadge } from '../shared/DifficultyBadge';
import { HintPanel } from '../shared/HintPanel';
import { EvaluationPanel } from '../shared/EvaluationPanel';

interface CodeLabWorkspaceProps {
  exercise: GeneratedExercise;
  onCodeEvaluated: (
    isCorrect: boolean,
    hintsUsed: number,
    attempts: number,
    evalResult: CodeEvaluationResult
  ) => void;
  onNextExercise: () => void;
}

export const CodeLabWorkspace: React.FC<CodeLabWorkspaceProps> = ({
  exercise,
  onCodeEvaluated,
  onNextExercise,
}) => {
  const [code, setCode] = useState(
    ProfileManager.getSavedCode(exercise.id) ||
      exercise.starter_code ||
      `# ${exercise.title}\n\ndef solve():\n    pass\n\n`
  );
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [evaluation, setEvaluation] = useState<CodeEvaluationResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [attempts, setAttempts] = useState(1);

  useEffect(() => {
    const saved = ProfileManager.getSavedCode(exercise.id);
    setCode(
      saved ||
        exercise.starter_code ||
        `# ${exercise.title}\n\ndef solve():\n    pass\n\n`
    );
    setHintsRevealed(0);
    setExecutionResult(null);
    setEvaluation(null);
    setAttempts(1);
  }, [exercise.id]);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setSaveStatus('idle');
    try {
      const result = await PythonRunner.executeCode(code, exercise.test_cases);
      setExecutionResult(result);
    } catch (e: any) {
      setExecutionResult({
        success: false,
        output: '',
        error: e?.message || 'Execution error',
        executionTimeMs: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveCode = () => {
    ProfileManager.saveCode(exercise.id, code);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code editor to starter template?')) {
      const reset = exercise.starter_code || `# ${exercise.title}\n`;
      setCode(reset);
      ProfileManager.saveCode(exercise.id, reset);
      setExecutionResult(null);
      setEvaluation(null);
    }
  };

  const handleSubmitEvaluation = async () => {
    // Run code first if not yet run
    setIsEvaluating(true);
    let runRes = executionResult;
    if (!runRes) {
      runRes = await PythonRunner.executeCode(code, exercise.test_cases);
      setExecutionResult(runRes);
    }

    try {
      const evalResult = await GeminiClient.evaluateCode(
        exercise,
        code,
        runRes.output,
        runRes.error
      );
      setEvaluation(evalResult);
      onCodeEvaluated(
        evalResult.status === 'correct',
        hintsRevealed,
        attempts,
        evalResult
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetry = () => {
    setEvaluation(null);
    setAttempts(prev => prev + 1);
  };

  return (
    <div id="code-lab-workspace" className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {exercise.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="capitalize">Topic: {exercise.topic.replace('-', ' ')}</span>
              <span>•</span>
              <span>Focus: Code Lab</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DifficultyBadge level={exercise.difficulty} />
        </div>
      </div>

      {/* Main Split: Left (Problem / Hints) & Right (Code Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Requirements & Hints */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Problem Description
              </h3>
              <p className="text-sm font-normal text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {exercise.question}
              </p>
            </div>

            {/* Constraints */}
            {exercise.constraints && exercise.constraints.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Constraints & Requirements
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {exercise.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expected Output */}
            {exercise.expected_output && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="block font-semibold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  Expected Output
                </span>
                <pre className="font-mono text-emerald-600 dark:text-emerald-400">
                  {exercise.expected_output}
                </pre>
              </div>
            )}
          </div>

          {/* Progressive Hint Ladder */}
          <HintPanel
            hints={exercise.hints}
            hintsRevealedCount={hintsRevealed}
            onRevealNextHint={() => setHintsRevealed(prev => prev + 1)}
          />
        </div>

        {/* Right Column: Code Editor & Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            {/* Editor Action Toolbar */}
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>solution.py</span>
                {saveStatus === 'saved' && (
                  <span className="text-[11px] text-emerald-600 font-sans font-semibold">
                    Saved locally
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="codelab-reset-btn"
                  onClick={handleResetCode}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  id="codelab-save-btn"
                  onClick={handleSaveCode}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                  title="Save code"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>

                <button
                  id="codelab-run-btn"
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
                </button>

                <button
                  id="codelab-evaluate-btn"
                  onClick={handleSubmitEvaluation}
                  disabled={isEvaluating}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isEvaluating ? 'Evaluating...' : 'Submit & Review'}</span>
                </button>
              </div>
            </div>

            {/* Python Code Textarea */}
            <div className="relative bg-slate-950">
              <textarea
                id="codelab-editor-textarea"
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                rows={14}
                className="w-full p-4 font-mono text-xs leading-relaxed text-emerald-300 bg-transparent border-none resize-y focus:outline-hidden selection:bg-indigo-500/30"
                placeholder="Write your Python solution here..."
              />
            </div>
          </div>

          {/* Execution Console & Test Output */}
          {executionResult && (
            <div
              id="codelab-console-output"
              className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs shadow-inner"
            >
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Console & Test Harness</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-slate-400" />
                  <span>{executionResult.executionTimeMs}ms</span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {executionResult.output && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      stdout:
                    </span>
                    <pre className="text-slate-200 whitespace-pre-wrap">
                      {executionResult.output}
                    </pre>
                  </div>
                )}

                {executionResult.error && (
                  <div className="text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/60">
                    <span className="font-bold block text-[10px] uppercase mb-0.5">
                      Runtime Error:
                    </span>
                    <pre className="whitespace-pre-wrap">{executionResult.error}</pre>
                  </div>
                )}

                {/* Deterministic Test Results */}
                {executionResult.testResults && executionResult.testResults.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Deterministic Test Cases:
                    </span>
                    {executionResult.testResults.map((tc, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded flex items-center justify-between text-[11px] ${
                          tc.passed
                            ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-900/40'
                            : 'bg-rose-950/30 text-rose-300 border border-rose-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{tc.passed ? '✓' : '✗'}</span>
                          <span>{tc.description}</span>
                        </div>
                        <span className="opacity-80">
                          {tc.passed ? 'Passed' : `Expected "${tc.expected}", got "${tc.actual}"`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Evaluation Breakdown Panel */}
          {evaluation && (
            <EvaluationPanel
              evaluation={evaluation}
              onRetry={handleRetry}
              onNext={onNextExercise}
            />
          )}
        </div>
      </div>
    </div>
  );
};
