import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Layers,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { GeneratedExercise } from '../../types';
import { DifficultyBadge } from '../shared/DifficultyBadge';

interface LearnUnderstandWorkspaceProps {
  exercise: GeneratedExercise;
  onStepCompleted: () => void;
  onNextExercise: () => void;
}

export const LearnUnderstandWorkspace: React.FC<LearnUnderstandWorkspaceProps> = ({
  exercise,
  onStepCompleted,
  onNextExercise,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [userPrediction, setUserPrediction] = useState('');
  const [isPredicted, setIsPredicted] = useState(false);

  // Core 7-phase learning cycle (Section 13)
  const steps = [
    {
      id: 'understand',
      label: '1. Understand',
      subtitle: 'Conceptual Mental Model',
      content: `In Python, variables do not hold values directly inside "storage boxes". Instead, variables are naming tags or references bound to objects in memory heap.`,
      visual: (
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs flex flex-wrap items-center justify-around gap-4">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-sky-400 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Variable Tag
            </span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">x</span>
          </div>
          <div className="text-slate-400 text-lg">───────►</div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-400 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              List Object [id: 0x104]
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">[1, 2]</span>
          </div>
        </div>
      ),
    },
    {
      id: 'predict',
      label: '2. Predict',
      subtitle: 'Active Recall Check',
      content: `If we now execute "y = x", does Python duplicate the list [1, 2], or attach a second sticky tag pointing to the same address?`,
      visual: (
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
              Tag x
            </span>
            <span className="text-slate-400">───►</span>
            <span className="p-2 rounded bg-white dark:bg-slate-900 border font-bold text-emerald-600">
              [1, 2]
            </span>
            <span className="text-slate-400">◄───</span>
            <span className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              Tag y
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'explain',
      label: '3. Explain & Dry Run',
      subtitle: 'In-Place Mutation Behavior',
      content: `Because both x and y point to the identical container, calling y.append(3) alters the container in place. When you evaluate x, you immediately see [1, 2, 3]!`,
      visual: (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs font-sans text-emerald-900 dark:text-emerald-200 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Key Takeaway:</span>
          </div>
          <p>
            Assignment never duplicates container items. To create an independent copy, use
            y = list(x) or y = x.copy().
          </p>
        </div>
      ),
    },
    {
      id: 'revisit',
      label: '4. Revisit & Retain',
      subtitle: 'Spaced Memory Lock',
      content: `Always ask: "Am I modifying the container in-place, or rebinding the tag to a newly created object?"`,
      visual: null,
    },
  ];

  const currentStep = steps[activeStepIndex];

  const handleNextStep = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else {
      onStepCompleted();
      onNextExercise();
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  return (
    <div id="learn-understand-workspace" className="max-w-4xl mx-auto space-y-6">
      {/* Exercise Metadata Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {exercise.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="capitalize">Topic: {exercise.topic.replace('-', ' ')}</span>
              <span>•</span>
              <span>Interactive Socratic Tutor</span>
            </div>
          </div>
        </div>

        <DifficultyBadge level={exercise.difficulty} />
      </div>

      {/* 4-Step Socratic Flow Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isDone = idx < activeStepIndex;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                isActive
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-bold shadow-xs'
                  : isDone
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-medium'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>{step.label}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
              <span className="text-[10px] font-normal block opacity-80 truncate">
                {step.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Step Interaction Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1 block">
            {currentStep.subtitle}
          </span>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            {currentStep.content}
          </p>
        </div>

        {/* Visual Diagram */}
        {currentStep.visual && <div>{currentStep.visual}</div>}

        {/* If Step 2 (Predict check-in), show interactive check */}
        {currentStep.id === 'predict' && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Check your mental model:
            </span>
            <div className="flex gap-2">
              <button
                id="predict-option-dup"
                onClick={() => {
                  setUserPrediction('duplicate');
                  setIsPredicted(true);
                }}
                className={`flex-1 p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                  userPrediction === 'duplicate'
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-800'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                Duplicates the list object
              </button>
              <button
                id="predict-option-same"
                onClick={() => {
                  setUserPrediction('same');
                  setIsPredicted(true);
                }}
                className={`flex-1 p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                  userPrediction === 'same'
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                Points to the exact same list
              </button>
            </div>
            {isPredicted && (
              <div className="text-xs p-2 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                {userPrediction === 'same'
                  ? '✓ Exactly right! Assignment in Python always shares the reference object.'
                  : 'Notice: Python never implicitly deep-copies objects upon assignment!'}
              </div>
            )}
          </div>
        )}

        {/* Footer Step Navigation */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={activeStepIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            id="tutor-step-next-btn"
            onClick={handleNextStep}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>{activeStepIndex === steps.length - 1 ? 'Complete & Advance' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
