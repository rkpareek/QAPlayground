import { LearningModeId, ModeProgress, UserProfile } from '../types';

export interface ProficiencyBand {
  min: number;
  max: number;
  label: string;
  badgeColor: string;
  description: string;
}

export const PROFICIENCY_BANDS: ProficiencyBand[] = [
  {
    min: 0,
    max: 39,
    label: 'Beginner',
    badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
    description: 'Learning fundamental syntax, expressions, and initial Python mental models.',
  },
  {
    min: 40,
    max: 54,
    label: 'Developing',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    description: 'Working with basic control flow and simple state variables.',
  },
  {
    min: 55,
    max: 69,
    label: 'Foundation',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    description: 'Solid grasp of loops, functions, lists, and basic condition branching.',
  },
  {
    min: 70,
    max: 79,
    label: 'Strong Foundation',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300',
    description: 'Comfortable with mutability vs references, dict processing, and multi-state tracking.',
  },
  {
    min: 80,
    max: 89,
    label: 'Intermediate',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    description: 'Fluent in collection transformations, data structures, and practical QA workflows.',
  },
  {
    min: 90,
    max: 94,
    label: 'Strong Intermediate',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300',
    description: 'Handles edge cases, algorithmic reasoning in English, and complex data models.',
  },
  {
    min: 95,
    max: 100,
    label: 'Advanced',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300',
    description: 'Production-ready Pythonic elegance, robust automation scripts, and high conceptual mastery.',
  },
];

export class ProficiencyEngine {
  static getBand(score: number): ProficiencyBand {
    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    return (
      PROFICIENCY_BANDS.find(b => clamped >= b.min && clamped <= b.max) ||
      PROFICIENCY_BANDS[0]
    );
  }

  /**
   * Calculates progressive updated score after an exercise attempt.
   * Rolling performance: newScore = (prevScore * 0.85) + (attemptScore * 0.15)
   * With penalties for hint reliance and repeated attempts.
   */
  static computeNewScore(
    prevScore: number,
    isCorrect: boolean,
    hintsUsed: number,
    attemptNumber: number,
    difficulty: number
  ): number {
    let attemptScore = isCorrect ? 100 : 30;

    // Hint dependency penalty
    if (hintsUsed > 0) {
      attemptScore = Math.max(20, attemptScore - hintsUsed * 12);
    }

    // Repeated attempts penalty
    if (attemptNumber > 1) {
      attemptScore = Math.max(20, attemptScore - (attemptNumber - 1) * 10);
    }

    // Difficulty scaling factor (higher difficulty rewards more for success)
    if (isCorrect && difficulty > 4) {
      attemptScore = Math.min(100, attemptScore + (difficulty - 4) * 2);
    }

    // Rolling exponential average: 85% previous, 15% new evidence
    const alpha = 0.15;
    const newScore = Math.round(prevScore * (1 - alpha) + attemptScore * alpha);
    return Math.max(0, Math.min(100, newScore));
  }

  /**
   * Recalculates overall profile score from 5 mode scores
   */
  static computeOverallScore(modeProgress: Record<LearningModeId, ModeProgress>): number {
    const weights: Record<LearningModeId, number> = {
      M: 0.15, // Quick Think
      L: 0.30, // Code Lab
      T: 0.15, // Learn & Understand
      P: 0.25, // Practical Lab
      E: 0.15, // Logic Builder
    };

    let total = 0;
    Object.entries(modeProgress).forEach(([mode, progress]) => {
      total += (progress.score || 0) * (weights[mode as LearningModeId] || 0.2);
    });

    return Math.max(0, Math.min(100, Math.round(total)));
  }

  /**
   * Determines if the learner is ready for level advancement
   */
  static shouldAdvanceLevel(
    currentLevel: number,
    modeScore: number,
    accuracy: number,
    consecutiveSuccesses: number
  ): boolean {
    if (currentLevel >= 10) return false;
    // Advance if mode score passes threshold for current level and demonstrated accuracy
    const requiredScore = currentLevel * 10 + 20;
    return modeScore >= requiredScore && accuracy >= 70 && consecutiveSuccesses >= 2;
  }
}
