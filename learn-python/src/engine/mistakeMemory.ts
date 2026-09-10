import { MistakeRecord } from '../types';
import { ProfileManager } from './profileManager';

export interface KnownMisconceptionPattern {
  id: string;
  title: string;
  detectorRegexes: RegExp[];
  conceptExplanation: string;
  recommendedReinforcementTopic: string;
}

export const KNOWN_MISCONCEPTIONS: KnownMisconceptionPattern[] = [
  {
    id: 'count_vs_sum',
    title: 'Counting vs Summing Confusion',
    detectorRegexes: [
      /(?:count|counter)\s*\+=\s*(?!1\b)[a-zA-Z_]\w*/i,
      /(?:total|sum)\s*\+=\s*1\b/i,
    ],
    conceptExplanation:
      'Counting means tallying events (counter += 1), whereas Summing means accumulating values (total += item).',
    recommendedReinforcementTopic: 'for-loops',
  },
  {
    id: 'mutation_vs_return',
    title: 'In-Place Mutation vs Return Assignment',
    detectorRegexes: [
      /\w+\s*=\s*\w+\.append\(/i,
      /\w+\s*=\s*\w+\.sort\(/i,
      /\w+\s*=\s*\w+\.reverse\(/i,
    ],
    conceptExplanation:
      'In-place methods like .append(), .sort(), and .reverse() modify the list directly and return None. Assigning back wipes out your variable!',
    recommendedReinforcementTopic: 'lists',
  },
  {
    id: 'print_vs_return',
    title: 'Print vs Return in Functions',
    detectorRegexes: [
      /def\s+\w+[\s\S]*?print\(.+?\)(?![\s\S]*?return\b)/,
    ],
    conceptExplanation:
      'print() displays text on screen for humans, while return hands data back to caller. Without return, a function evaluates to None.',
    recommendedReinforcementTopic: 'func-definition',
  },
  {
    id: 'is_vs_equality',
    title: 'Identity (is) vs Equality (==)',
    detectorRegexes: [
      /\bis\s+(?:["'][^"']*["']|\d+)/i,
      /==\s*None\b/i,
    ],
    conceptExplanation:
      'Use == to check if values match. Use "is" strictly for checking object identity (e.g. "if x is None").',
    recommendedReinforcementTopic: 'references-identity',
  },
  {
    id: 'mutable_default_arg',
    title: 'Mutable Default Argument Trap',
    detectorRegexes: [
      /def\s+\w+\([^)]*=\s*(\[\]|\{\})/i,
    ],
    conceptExplanation:
      'Default arguments like def fn(x=[]) are evaluated once at definition time, sharing the same mutable container across calls!',
    recommendedReinforcementTopic: 'arguments',
  },
];

export class MistakeMemory {
  /**
   * Scans Python code submission or English explanation text for common recurring misconceptions
   */
  static analyzeCodeForMisconceptions(code: string, topic = 'general'): KnownMisconceptionPattern[] {
    const detected: KnownMisconceptionPattern[] = [];

    for (const pattern of KNOWN_MISCONCEPTIONS) {
      for (const regex of pattern.detectorRegexes) {
        if (regex.test(code)) {
          detected.push(pattern);
          ProfileManager.recordMistake(
            topic,
            pattern.id,
            pattern.title,
            pattern.conceptExplanation
          );
          break;
        }
      }
    }

    return detected;
  }

  /**
   * Returns unresolved recurring mistakes to prioritize for adaptive reinforcement
   */
  static getActiveMisconceptions(): MistakeRecord[] {
    const mistakes = ProfileManager.getMistakes();
    return mistakes.filter(m => !m.resolved && m.occurrences >= 1);
  }

  /**
   * Checks if learner has a known weakness in a given topic
   */
  static hasWeakness(topic: string): boolean {
    const active = this.getActiveMisconceptions();
    return active.some(m => m.topic === topic);
  }
}
