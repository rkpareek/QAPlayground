import React from 'react';
import { DIFFICULTY_LEVEL_DESCRIPTIONS } from '../../types/curriculum';

interface DifficultyBadgeProps {
  level: number;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ level }) => {
  const meta = DIFFICULTY_LEVEL_DESCRIPTIONS[level] || {
    title: `Level ${level}`,
    focus: 'Python problem solving',
  };

  const getBadgeTone = (lvl: number) => {
    if (lvl <= 2) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    if (lvl <= 4) return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800';
    if (lvl <= 6) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    if (lvl <= 8) return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
    return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
  };

  return (
    <div
      id={`difficulty-badge-level-${level}`}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getBadgeTone(
        level
      )} shadow-xs`}
      title={meta.focus}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>Lvl {level}</span>
      <span className="opacity-60 hidden sm:inline">| {meta.title.split(':')[1] || meta.title}</span>
    </div>
  );
};
