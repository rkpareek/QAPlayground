import React from 'react';
import { ProficiencyEngine } from '../../engine/proficiencyEngine';

interface ScoreBadgeProps {
  score: number;
  showBandLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  showBandLabel = true,
  size = 'md',
}) => {
  const band = ProficiencyEngine.getBand(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-semibold',
  };

  return (
    <div
      id="proficiency-score-badge"
      className={`inline-flex items-center gap-1.5 rounded-full border ${band.badgeColor} ${sizeClasses[size]} font-mono font-medium transition-all shadow-xs`}
      title={band.description}
    >
      <span>{Math.round(score)}%</span>
      {showBandLabel && (
        <span className="font-sans text-[11px] font-semibold tracking-wide uppercase opacity-90 border-l border-current/20 pl-1.5">
          {band.label}
        </span>
      )}
    </div>
  );
};
