import React from 'react';
import { Sparkles, Flame, Settings, ArrowLeft, RefreshCw } from 'lucide-react';
import { LearningModeId, LEARNING_MODES, UserProfile } from '../../types';
import { ScoreBadge } from './ScoreBadge';

interface ProgressHeaderProps {
  currentMode?: LearningModeId | null;
  profile: UserProfile;
  onBackToDashboard: () => void;
  onOpenSettings: () => void;
  onResetData?: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentMode,
  profile,
  onBackToDashboard,
  onOpenSettings,
  onResetData,
}) => {
  const activeModeMeta = currentMode ? LEARNING_MODES[currentMode] : null;

  return (
    <header
      id="learn-python-header"
      className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Mode navigation */}
        <div className="flex items-center gap-3">
          {activeModeMeta ? (
            <button
              id="header-back-button"
              onClick={onBackToDashboard}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-sm font-medium"
              title="Return to Modes Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Modes</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Python Coach
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                  v2.0
                </span>
              </div>
            </div>
          )}

          {activeModeMeta && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {activeModeMeta.name}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 hidden md:inline">
                • {activeModeMeta.tagline}
              </span>
            </div>
          )}
        </div>

        {/* Right: Metrics & Settings */}
        <div className="flex items-center gap-3">
          {/* Streak indicator */}
          <div
            id="streak-indicator"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold"
            title={`${profile.current_streak} Day Practice Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{profile.current_streak}</span>
          </div>

          {/* Overall proficiency */}
          <ScoreBadge score={profile.overall_score} />

          {/* Settings button */}
          <button
            id="header-settings-button"
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Settings & API Key"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
