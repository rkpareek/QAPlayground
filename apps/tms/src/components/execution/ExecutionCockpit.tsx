import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TestCaseExecutionStatus,
  DefectSeverity,
} from '../../types';
import {
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  FastForward,
  Bug,
  Clock,
  User,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import { PriorityBadge, ExecutionBadge, StatusBadge } from '../common/Badges';

export const ExecutionCockpit: React.FC = () => {
  const {
    currentProject,
    testRuns,
    testCases,
    defects,
    users,
    environments,
    selectedTestRunId,
    setSelectedTestRunId,
    selectedTestCaseId,
    setSelectedTestCaseId,
    recordTestExecution,
    updateTestRunStatus,
    createDefect,
    createTestRun,
    setNavSection,
    setSelectedDefectId,
  } = useApp();

  // Active Run
  const activeRuns = testRuns.filter((r) => r.projectId === currentProject.id && !r.isArchived);
  const currentRun = activeRuns.find((r) => r.id === selectedTestRunId) || activeRuns[0];

  // Active Test Item in Run
  const runItems = currentRun?.items || [];
  const currentItem =
    runItems.find((it) => it.testCaseId === selectedTestCaseId) || runItems[0];

  // Active Test Case Entity snapshot
  const activeTestCase = useMemo(() => {
    if (!currentItem) return null;
    const direct = testCases.find((tc) => tc.id === currentItem.testCaseId);
    return direct || currentItem.testCaseSnapshot || null;
  }, [currentItem, testCases]);

  // Execution Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Execution Notes & Step results
  const [actualResultNotes, setActualResultNotes] = useState('');
  const [stepResults, setStepResults] = useState<Record<string, { status: TestCaseExecutionStatus; actual?: string }>>({});
  const [isLoggingDefect, setIsLoggingDefect] = useState(false);
  const [defectTitle, setDefectTitle] = useState('');
  const [defectSeverity, setDefectSeverity] = useState<DefectSeverity>('major');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Timer Tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Reset local step states when switching test case
  useEffect(() => {
    if (currentItem) {
      setActualResultNotes(currentItem.notes || '');
      setTimerSeconds(currentItem.durationSeconds || 0);
      setIsTimerRunning(true);
      const initialStepResults: Record<string, { status: TestCaseExecutionStatus; actual?: string }> = {};
      currentItem.stepResults?.forEach((sr) => {
        initialStepResults[sr.stepId] = { status: sr.status, actual: sr.actualResult };
      });
      setStepResults(initialStepResults);
    }
  }, [currentItem?.testCaseId, currentRun?.id]);

  // Keyboard Shortcuts for Rapid QA: P = Pass, F = Fail, B = Block
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'p' || e.key === 'P') {
        handleMarkStatus('passed');
      } else if (e.key === 'f' || e.key === 'F') {
        handleMarkStatus('failed');
      } else if (e.key === 'b' || e.key === 'B') {
        handleMarkStatus('blocked');
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNextTest();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevTest();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentItem, currentRun, stepResults, timerSeconds, actualResultNotes]);

  // Step Status Toggle
  const handleToggleStepStatus = (stepId: string, status: TestCaseExecutionStatus) => {
    const updated = {
      ...stepResults,
      [stepId]: { ...stepResults[stepId], status },
    };
    setStepResults(updated);
  };

  const handleStepActualChange = (stepId: string, actual: string) => {
    const updated = {
      ...stepResults,
      [stepId]: { ...stepResults[stepId], actual, status: stepResults[stepId]?.status || 'passed' },
    };
    setStepResults(updated);
  };

  // Mark Status for entire test case
  const handleMarkStatus = (status: TestCaseExecutionStatus) => {
    if (!currentRun || !currentItem) return;

    // Convert step results map to array
    const stepResultsArray = activeTestCase?.steps.map((st) => ({
      stepId: st.id,
      status: stepResults[st.id]?.status || (status === 'passed' ? 'passed' : status === 'failed' ? 'failed' : 'not_run'),
      actualResult: stepResults[st.id]?.actual || '',
    })) || [];

    recordTestExecution(
      currentRun.id,
      currentItem.testCaseId,
      status,
      stepResultsArray,
      timerSeconds,
      actualResultNotes
    );

    if (status === 'failed') {
      // Auto open defect log preview
      setDefectTitle(`[Failed Test] ${activeTestCase?.title}`);
      setIsLoggingDefect(true);
    } else {
      // Advance to next test case automatically
      handleNextTest();
    }
  };

  // Navigation between items
  const currentIndex = runItems.findIndex((it) => it.testCaseId === currentItem?.testCaseId);

  const handleNextTest = () => {
    if (currentIndex < runItems.length - 1) {
      setSelectedTestCaseId(runItems[currentIndex + 1].testCaseId);
    }
  };

  const handlePrevTest = () => {
    if (currentIndex > 0) {
      setSelectedTestCaseId(runItems[currentIndex - 1].testCaseId);
    }
  };

  // Submit Defect
  const handleSaveDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectTitle.trim() || !currentRun || !currentItem) return;

    const stepsToRepro = activeTestCase?.steps
      .map((st, i) => `${i + 1}. ${st.action} -> Expected: ${st.expectedResult}`)
      .join('\n') || '';

    const created = createDefect({
      title: defectTitle,
      severity: defectSeverity,
      stepsToReproduce: stepsToRepro,
      actualBehavior: actualResultNotes || 'Observed failure during test execution.',
      expectedBehavior: activeTestCase?.steps[activeTestCase.steps.length - 1]?.expectedResult || '',
      linkedTestCaseId: currentItem.testCaseId,
      linkedRunId: currentRun.id,
      environmentId: currentRun.environmentId,
      buildVersion: currentRun.buildVersion,
    });

    setIsLoggingDefect(false);
    // Link defect to run item
    recordTestExecution(
      currentRun.id,
      currentItem.testCaseId,
      'failed',
      [],
      timerSeconds,
      actualResultNotes,
      [created.id]
    );
  };

  if (!currentRun) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8 text-center text-xs">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-md space-y-4">
          <PlayCircle className="w-12 h-12 text-blue-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Active Test Runs Found</h2>
          <p className="text-slate-500">
            Create an execution run from the Test Repository or Test Runs view to begin testing.
          </p>
          <button
            onClick={() => setNavSection('repository')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
          >
            Go to Test Repository
          </button>
        </div>
      </div>
    );
  }

  // Filter run items in list
  const filteredRunItems = runItems.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const title = item.testCaseSnapshot?.title?.toLowerCase() || '';
      return item.testCaseId.toLowerCase().includes(q) || title.includes(q);
    }
    return true;
  });

  // Calculate run completion stats
  const runPassed = runItems.filter((i) => i.status === 'passed').length;
  const runFailed = runItems.filter((i) => i.status === 'failed').length;
  const runBlocked = runItems.filter((i) => i.status === 'blocked').length;
  const runExecuted = runPassed + runFailed + runBlocked;
  const runPercent = runItems.length > 0 ? Math.round((runExecuted / runItems.length) * 100) : 0;

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100">
      {/* 1. LEFT PANE: Run Items Navigation */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none">
        {/* Run Selector Header */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Execution Cycle</span>
            <span className="font-mono text-xs font-bold text-blue-700">{runPercent}% Done</span>
          </div>

          <select
            value={currentRun.id}
            onChange={(e) => setSelectedTestRunId(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
          >
            {activeRuns.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.buildVersion})
              </option>
            ))}
          </select>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${(runPassed / runItems.length) * 100}%` }} />
            <div className="bg-red-500 h-full" style={{ width: `${(runFailed / runItems.length) * 100}%` }} />
            <div className="bg-amber-500 h-full" style={{ width: `${(runBlocked / runItems.length) * 100}%` }} />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="text-emerald-700 font-semibold">{runPassed} P</span>
            <span className="text-red-700 font-semibold">{runFailed} F</span>
            <span className="text-amber-700 font-semibold">{runBlocked} B</span>
            <span>{runItems.length - runExecuted} Left</span>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-2 border-b border-slate-200 flex items-center gap-1.5 text-xs">
          <div className="relative flex-1">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Search tests in run..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-6 pr-2 py-1 rounded border border-slate-200 text-xs outline-hidden"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-1.5 py-1 rounded border border-slate-200 text-slate-700 text-xs bg-slate-50"
          >
            <option value="all">All</option>
            <option value="not_run">Not Run</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          {filteredRunItems.map((item, idx) => {
            const isSelected = item.testCaseId === currentItem?.testCaseId;
            const tc = testCases.find((c) => c.id === item.testCaseId) || item.testCaseSnapshot;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedTestCaseId(item.testCaseId)}
                className={`p-2.5 cursor-pointer transition-colors flex items-start gap-2.5 ${
                  isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {item.status === 'failed' && <XCircle className="w-4 h-4 text-red-600" />}
                  {item.status === 'blocked' && <AlertOctagon className="w-4 h-4 text-amber-600" />}
                  {item.status === 'not_run' && <span className="w-4 h-4 rounded-full border-2 border-slate-300 block" />}
                  {item.status === 'skipped' && <FastForward className="w-4 h-4 text-slate-400" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-600">{item.testCaseId}</span>
                    {tc?.priority && <PriorityBadge priority={tc.priority} />}
                  </div>
                  <div className="font-medium text-slate-800 line-clamp-1 mt-0.5 leading-snug">
                    {tc?.title || item.testCaseId}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Run Actions Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (confirm('Mark this execution run as Completed?')) {
                updateTestRunStatus(currentRun.id, 'completed');
              }
            }}
            className="w-full py-1.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white font-semibold text-center transition-colors"
          >
            Finish & Close Run
          </button>
        </div>
      </div>

      {/* 2. CENTER STAGE: Test Execution Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50">
        {/* Cockpit Top Header */}
        <div className="p-5 bg-white border-b border-slate-200 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                {activeTestCase?.id}
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  {activeTestCase?.title}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span>Run: {currentRun.name}</span>
                  <span>•</span>
                  <span>Environment: {environments.find((e) => e.id === currentRun.environmentId)?.name}</span>
                </div>
              </div>
            </div>

            {/* Stopwatch Timer & Navigation */}
            <div className="flex items-center gap-3">
              {/* Timer */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono text-sm font-bold">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{formatTime(timerSeconds)}</span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 hover:text-blue-600 transition-colors ml-1"
                  title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                >
                  {isTimerRunning ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setTimerSeconds(0)}
                  className="p-1 hover:text-slate-900 transition-colors"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevTest}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  title="Previous test (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-500 px-1">
                  {currentIndex + 1} / {runItems.length}
                </span>
                <button
                  onClick={handleNextTest}
                  disabled={currentIndex === runItems.length - 1}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  title="Next test (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="flex items-center gap-2 pt-1">
            {activeTestCase?.priority && <PriorityBadge priority={activeTestCase.priority} />}
            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded capitalize">
              {activeTestCase?.testType || 'functional'}
            </span>
            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Est: {activeTestCase?.estimatedDurationMinutes || 3}m
            </span>
            {currentItem?.status && <ExecutionBadge status={currentItem.status} />}
          </div>
        </div>

        {/* Cockpit Execution Body */}
        <div className="p-6 space-y-5 text-xs max-w-5xl">
          {/* Preconditions Notice */}
          {activeTestCase?.preconditions && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Pre-Execution Verification
              </div>
              <p className="text-amber-800 leading-relaxed pl-5">{activeTestCase.preconditions}</p>
            </div>
          )}

          {/* Interactive Steps Execution List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-800 text-xs">
              <span>Interactive Step Validation</span>
              <span className="text-slate-500 font-normal text-[11px]">
                Mark each step as you verify or set overall case status below
              </span>
            </div>

            {activeTestCase?.steps && activeTestCase.steps.length > 0 ? (
              activeTestCase.steps.map((step, idx) => {
                const sStatus = stepResults[step.id]?.status || 'not_run';

                return (
                  <div
                    key={step.id || idx}
                    className={`p-4 rounded-xl border bg-white shadow-2xs space-y-3 transition-colors ${
                      sStatus === 'passed'
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : sStatus === 'failed'
                        ? 'border-red-200 bg-red-50/20'
                        : sStatus === 'blocked'
                        ? 'border-amber-200 bg-amber-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[10px] mt-0.5 shrink-0">
                          {idx + 1}
                        </span>

                        <div className="space-y-1.5 flex-1">
                          <div className="font-semibold text-slate-900 text-xs leading-relaxed">
                            {step.action}
                          </div>

                          {step.testData && (
                            <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                              <span className="font-sans font-semibold text-slate-400 block text-[10px]">
                                Test Input Data:
                              </span>
                              {step.testData}
                            </div>
                          )}

                          <div className="text-slate-600 bg-blue-50/50 p-2 rounded border border-blue-100 leading-relaxed">
                            <span className="font-semibold text-blue-900 block text-[10px] uppercase">
                              Expected Result:
                            </span>
                            {step.expectedResult}
                          </div>
                        </div>
                      </div>

                      {/* Step Toggle Status Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleStepStatus(step.id, 'passed')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                            sStatus === 'passed'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-emerald-100 text-slate-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" /> Pass
                        </button>
                        <button
                          onClick={() => handleToggleStepStatus(step.id, 'failed')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                            sStatus === 'failed'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-red-100 text-slate-700'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Fail
                        </button>
                        <button
                          onClick={() => handleToggleStepStatus(step.id, 'blocked')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                            sStatus === 'blocked'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-amber-100 text-slate-700'
                          }`}
                        >
                          <AlertOctagon className="w-3.5 h-3.5" /> Block
                        </button>
                      </div>
                    </div>

                    {/* Step Actual note (shown if failed or user inputs) */}
                    {(sStatus === 'failed' || stepResults[step.id]?.actual) && (
                      <div className="pt-2 border-t border-slate-100">
                        <input
                          type="text"
                          placeholder="Step actual observation / error message..."
                          value={stepResults[step.id]?.actual || ''}
                          onChange={(e) => handleStepActualChange(step.id, e.target.value)}
                          className="w-full px-2.5 py-1 rounded border border-red-200 text-xs bg-red-50/50 outline-hidden"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-500">
                No individual steps defined. Execute scenario based on summary instructions.
              </div>
            )}
          </div>

          {/* Actual Result & Execution Notes Input */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
            <label className="block font-bold text-slate-800 text-xs">
              Execution Findings & Observations
            </label>
            <textarea
              rows={3}
              placeholder="Record test results, API response codes, deviations, or logs..."
              value={actualResultNotes}
              onChange={(e) => setActualResultNotes(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 text-slate-900 text-xs outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Inline Defect Logger if opened */}
          {isLoggingDefect && (
            <form onSubmit={handleSaveDefect} className="bg-red-50/70 p-5 rounded-xl border-2 border-red-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-bold text-red-900">Log Defect for Failed Test</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLoggingDefect(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Defect Title *</label>
                <input
                  type="text"
                  required
                  value={defectTitle}
                  onChange={(e) => setDefectTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Defect Severity</label>
                  <select
                    value={defectSeverity}
                    onChange={(e) => setDefectSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs bg-white"
                  >
                    <option value="critical">Critical / Blocker</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                    <option value="trivial">Trivial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Environment</label>
                  <input
                    type="text"
                    disabled
                    value={`${currentRun.environmentId} (Build: ${currentRun.buildVersion})`}
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 text-xs bg-slate-100 text-slate-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Bug className="w-4 h-4" />
                  Save Defect & Link to Test
                </button>
              </div>
            </form>
          )}

          {/* Global Result Action Buttons */}
          <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-300 shadow-xl flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Set Result:</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(Hotkeys: P, F, B)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarkStatus('passed')}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>PASS</span>
                <kbd className="text-[10px] bg-emerald-800/60 px-1 py-0.2 rounded font-mono">P</kbd>
              </button>

              <button
                onClick={() => handleMarkStatus('failed')}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>FAIL</span>
                <kbd className="text-[10px] bg-red-800/60 px-1 py-0.2 rounded font-mono">F</kbd>
              </button>

              <button
                onClick={() => handleMarkStatus('blocked')}
                className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>BLOCK</span>
                <kbd className="text-[10px] bg-amber-800/60 px-1 py-0.2 rounded font-mono">B</kbd>
              </button>

              <button
                onClick={() => handleMarkStatus('skipped')}
                className="px-3 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <FastForward className="w-4 h-4" />
                <span>Skip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
