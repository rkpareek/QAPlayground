import React from 'react';
import {
  UserProfile,
  ModeProgress,
  TopicProgress,
  MistakeRecord,
  LearningModeId,
} from '../../types';
import { ProficiencyOverview } from './ProficiencyOverview';
import { ModeCard } from './ModeCard';
import { WeakAreasSummary } from './WeakAreasSummary';

interface HomeDashboardProps {
  profile: UserProfile;
  modeProgress: Record<LearningModeId, ModeProgress>;
  topicProgress: Record<string, TopicProgress>;
  mistakes: MistakeRecord[];
  onSelectMode: (modeId: LearningModeId) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  modeProgress,
  topicProgress,
  mistakes,
  onSelectMode,
}) => {
  const modesList: LearningModeId[] = ['M', 'L', 'T', 'P', 'E'];

  // Helper to extract weak topics for a mode
  const getWeakTopicsForMode = (mode: LearningModeId): string[] => {
    const activeMistakes = mistakes.filter(m => !m.resolved);
    if (activeMistakes.length > 0) {
      return [...new Set(activeMistakes.map(m => m.topic))].slice(0, 2);
    }
    return [];
  };

  return (
    <div id="home-dashboard" className="space-y-6 animate-fade-in">
      {/* Top Banner with Proficiency Overview */}
      <ProficiencyOverview profile={profile} topicProgress={topicProgress} />

      {/* Mistake Memory & Weak Areas Banner */}
      <WeakAreasSummary mistakes={mistakes} />

      {/* Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Select Learning Mode
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dedicated workspaces designed around our core learning loop: Understand → Predict → Explain → Code → Debug → Optimize → Revisit.
          </p>
        </div>
      </div>

      {/* Five Mode Cards Grid (Section 2 & 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modesList.map(modeId => (
          <ModeCard
            key={modeId}
            modeId={modeId}
            progress={modeProgress[modeId]}
            weakTopics={getWeakTopicsForMode(modeId)}
            onSelect={onSelectMode}
          />
        ))}
      </div>
    </div>
  );
};
