import React from 'react';
import { Award, TrendingUp, CheckCircle, AlertCircle, Compass } from 'lucide-react';
import { UserProfile, TopicProgress } from '../../types';
import { ProficiencyEngine } from '../../engine/proficiencyEngine';
import { ScoreBadge } from '../shared/ScoreBadge';

interface ProficiencyOverviewProps {
  profile: UserProfile;
  topicProgress: Record<string, TopicProgress>;
}

export const ProficiencyOverview: React.FC<ProficiencyOverviewProps> = ({
  profile,
  topicProgress,
}) => {
  const band = ProficiencyEngine.getBand(profile.overall_score);

  const topicsArray = Object.values(topicProgress);
  const strongest = [...topicsArray]
    .filter(t => t.mastery_score >= 70)
    .sort((a, b) => b.mastery_score - a.mastery_score)
    .slice(0, 3);

  const needsPractice = [...topicsArray]
    .filter(t => t.mastery_score < 65)
    .sort((a, b) => a.mastery_score - b.mastery_score)
    .slice(0, 3);

  return (
    <div
      id="proficiency-overview-card"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Python Proficiency & Mastery
            </h2>
            <ScoreBadge score={profile.overall_score} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Weighted rolling performance across mental reasoning, coding precision, and algorithmic design.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Solved
            </span>
            <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
              {profile.total_correct} / {profile.total_questions}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Current Level
            </span>
            <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
              Tier {profile.overall_level}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          <span>Overall Mastery Progress</span>
          <span>{Math.round(profile.overall_score)}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${Math.max(6, profile.overall_score)}%` }}
          />
        </div>
      </div>

      {/* Analytics 3-column breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Strongest */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Strongest Concepts</span>
          </div>
          {strongest.length > 0 ? (
            <div className="space-y-1">
              {strongest.map(s => (
                <div
                  key={s.topic}
                  className="flex items-center justify-between text-slate-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/20 px-2 py-1 rounded"
                >
                  <span className="capitalize">{s.topic.replace('-', ' ')}</span>
                  <span className="font-mono font-semibold text-[11px] text-emerald-600">
                    {s.mastery_score}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">Complete more exercises to establish mastery.</p>
          )}
        </div>

        {/* Needs Practice */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Needs Practice</span>
          </div>
          {needsPractice.length > 0 ? (
            <div className="space-y-1">
              {needsPractice.map(n => (
                <div
                  key={n.topic}
                  className="flex items-center justify-between text-slate-700 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 px-2 py-1 rounded"
                >
                  <span className="capitalize">{n.topic.replace('-', ' ')}</span>
                  <span className="font-mono font-semibold text-[11px] text-amber-600">
                    {n.mastery_score}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">No low-mastery topics identified yet.</p>
          )}
        </div>

        {/* Current Focus */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Current Learning Focus</span>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200">
            <div className="font-semibold">{band.label} Track</div>
            <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">
              {band.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
