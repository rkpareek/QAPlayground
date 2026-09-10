import { LearningModeId } from '../types';
import { ProfileManager } from './profileManager';
import { CURRICULUM_CATEGORIES } from '../types/curriculum';

export interface AdaptiveRecommendation {
  topic: string;
  difficulty: number;
  isReinforcement: boolean;
  reason: string;
  focusMisconception?: string;
}

export class AdaptiveEngine {
  /**
   * Evaluates the learner's state and picks the optimal next topic and difficulty
   */
  static getNextRecommendation(mode: LearningModeId): AdaptiveRecommendation {
    const modeProgress = ProfileManager.getModeProgress()[mode];
    const topicProgress = ProfileManager.getTopicProgress();
    const mistakes = ProfileManager.getMistakes();

    const currentLevel = modeProgress ? modeProgress.current_level : 1;

    // Check 1: Do we have an unresolved active mistake?
    const unresolvedMistake = mistakes.find(m => !m.resolved && m.occurrences >= 2);
    if (unresolvedMistake) {
      return {
        topic: unresolvedMistake.topic,
        difficulty: Math.max(1, currentLevel - 1),
        isReinforcement: true,
        reason: `Revisiting ${unresolvedMistake.description} to solidify reasoning.`,
        focusMisconception: unresolvedMistake.mistake_type,
      };
    }

    // Check 2: Are there weak topics with mastery < 60%?
    const weakTopics = Object.values(topicProgress).filter(
      t => t.mastery_score < 60 && t.attempts >= 2
    );
    if (weakTopics.length > 0) {
      // Pick the weakest topic
      weakTopics.sort((a, b) => a.mastery_score - b.mastery_score);
      return {
        topic: weakTopics[0].topic,
        difficulty: currentLevel,
        isReinforcement: true,
        reason: `Reinforcing topic "${weakTopics[0].topic}" where current mastery is ${weakTopics[0].mastery_score}%.`,
      };
    }

    // Check 3: Check curriculum progression for current level
    const candidateTopics: string[] = [];
    for (const cat of CURRICULUM_CATEGORIES) {
      if (cat.minLevel <= currentLevel + 1) {
        for (const t of cat.topics) {
          candidateTopics.push(t.id);
        }
      }
    }

    // Pick topic least recently seen or not attempted yet
    let selectedTopic = candidateTopics[0] || 'for-loops';
    let oldestTimestamp = Date.now();

    for (const topicId of candidateTopics) {
      const progress = topicProgress[topicId];
      if (!progress) {
        // Never attempted, great candidate!
        selectedTopic = topicId;
        break;
      }
      const seenTime = new Date(progress.last_seen).getTime();
      if (seenTime < oldestTimestamp) {
        oldestTimestamp = seenTime;
        selectedTopic = topicId;
      }
    }

    // Calculate adaptive difficulty:
    // If accuracy is high (> 75%), challenge with currentLevel, otherwise currentLevel
    const targetDifficulty = Math.min(10, Math.max(1, currentLevel));

    return {
      topic: selectedTopic,
      difficulty: targetDifficulty,
      isReinforcement: false,
      reason: `Advancing to Level ${targetDifficulty} with topic "${selectedTopic}".`,
    };
  }
}
