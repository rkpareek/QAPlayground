import React from 'react';
import {
  Zap,
  Code2,
  GraduationCap,
  Briefcase,
  BrainCircuit,
  ArrowRight,
  Target,
  CheckCircle,
} from 'lucide-react';
import { LearningModeId, LEARNING_MODES, ModeProgress } from '../../types';
import { DifficultyBadge } from '../shared/DifficultyBadge';

interface ModeCardProps {
  modeId: LearningModeId;
  progress: ModeProgress;
  weakTopics?: string[];
  onSelect: (modeId: LearningModeId) => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  modeId,
  progress,
  weakTopics = [],
  onSelect,
}) => {
  const meta = LEARNING_MODES[modeId];

  const getIcon = () => {
    switch (modeId) {
      case 'M':
        return <Zap className="w-5 h-5" />;
      case 'L':
        return <Code2 className="w-5 h-5" />;
      case 'T':
        return <GraduationCap className="w-5 h-5" />;
      case 'P':
        return <Briefcase className="w-5 h-5" />;
      case 'E':
        return <BrainCircuit className="w-5 h-5" />;
    }
  };

  return (
    <div
      id={`mode-card-${modeId.toLowerCase()}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
    >
      <div>
        {/* Top header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${meta.accentClass}`}
            >
              {getIcon()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {meta.name}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {meta.tagline}
              </span>
            </div>
          </div>

          <DifficultyBadge level={progress.current_level} />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {meta.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-3 text-center">
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Accuracy
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
              {progress.accuracy}%
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Completed
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
              {progress.questions_correct}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Attempts
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
              {progress.questions_attempted}
            </span>
          </div>
        </div>

        {/* Weak topics alert if any */}
        {weakTopics.length > 0 && (
          <div className="mb-4 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1.5 font-medium">
            <Target className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span>Targeting: {weakTopics.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <button
        id={`continue-mode-${modeId.toLowerCase()}-btn`}
        onClick={() => onSelect(modeId)}
        className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-emerald-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-emerald-400 dark:hover:text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        <span>Continue {meta.name}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
