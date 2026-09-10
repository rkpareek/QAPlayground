import {
  UserProfile,
  ModeProgress,
  TopicProgress,
  MistakeRecord,
  LearningEvent,
  LearningModeId,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'learn_python_user_profile',
  MODE_PROGRESS: 'learn_python_mode_progress',
  TOPIC_PROGRESS: 'learn_python_topic_progress',
  MISTAKE_RECORDS: 'learn_python_mistake_records',
  LEARNING_EVENTS: 'learn_python_learning_events',
  SAVED_CODE: 'learn_python_saved_code',
  API_KEY: 'learn_python_gemini_api_key',
};

const DEFAULT_PROFILE: UserProfile = {
  user_id: 'learner_default',
  created_at: new Date().toISOString(),
  last_active_at: new Date().toISOString(),
  overall_level: 2,
  overall_score: 48,
  current_streak: 3,
  total_questions: 14,
  total_correct: 10,
  total_attempts: 16,
};

const DEFAULT_MODE_PROGRESS: Record<LearningModeId, ModeProgress> = {
  M: {
    user_id: 'learner_default',
    mode: 'M',
    score: 62,
    accuracy: 75,
    questions_attempted: 8,
    questions_correct: 6,
    current_level: 2,
    highest_level: 3,
    average_attempts: 1.2,
  },
  L: {
    user_id: 'learner_default',
    mode: 'L',
    score: 52,
    accuracy: 66,
    questions_attempted: 3,
    questions_correct: 2,
    current_level: 2,
    highest_level: 2,
    average_attempts: 1.6,
  },
  T: {
    user_id: 'learner_default',
    mode: 'T',
    score: 58,
    accuracy: 80,
    questions_attempted: 5,
    questions_correct: 4,
    current_level: 2,
    highest_level: 2,
    average_attempts: 1.1,
  },
  P: {
    user_id: 'learner_default',
    mode: 'P',
    score: 46,
    accuracy: 60,
    questions_attempted: 5,
    questions_correct: 3,
    current_level: 2,
    highest_level: 3,
    average_attempts: 1.5,
  },
  E: {
    user_id: 'learner_default',
    mode: 'E',
    score: 40,
    accuracy: 50,
    questions_attempted: 2,
    questions_correct: 1,
    current_level: 1,
    highest_level: 2,
    average_attempts: 2.0,
  },
};

const DEFAULT_TOPIC_PROGRESS: Record<string, TopicProgress> = {
  variables: {
    topic: 'variables',
    mastery_score: 85,
    attempts: 6,
    correct: 6,
    mistakes: 0,
    last_seen: new Date(Date.now() - 3600000 * 24).toISOString(),
    confidence: 90,
  },
  'for-loops': {
    topic: 'for-loops',
    mastery_score: 68,
    attempts: 8,
    correct: 6,
    mistakes: 2,
    last_seen: new Date().toISOString(),
    confidence: 65,
  },
  lists: {
    topic: 'lists',
    mastery_score: 55,
    attempts: 5,
    correct: 3,
    mistakes: 2,
    last_seen: new Date().toISOString(),
    confidence: 50,
  },
  'json-api-parsing': {
    topic: 'json-api-parsing',
    mastery_score: 40,
    attempts: 2,
    correct: 1,
    mistakes: 1,
    last_seen: new Date(Date.now() - 3600000 * 48).toISOString(),
    confidence: 45,
  },
};

const DEFAULT_MISTAKES: MistakeRecord[] = [
  {
    id: 'mstk-count-vs-sum',
    topic: 'for-loops',
    mistake_type: 'count_vs_sum',
    description: 'Uses += item instead of += 1 when counting occurrences',
    example: 'count += x instead of count += 1',
    occurrences: 2,
    last_seen: new Date().toISOString(),
    resolved: false,
    consecutive_successes: 1,
  },
  {
    id: 'mstk-append-return',
    topic: 'lists',
    mistake_type: 'mutation_vs_return',
    description: 'Assigns result of list.append(), resulting in None',
    example: 'items = items.append(x)',
    occurrences: 2,
    last_seen: new Date().toISOString(),
    resolved: false,
    consecutive_successes: 0,
  },
];

export class ProfileManager {
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) {
        this.saveProfile(DEFAULT_PROFILE);
        return DEFAULT_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(profile: UserProfile): void {
    try {
      profile.last_active_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed saving profile', e);
    }
  }

  static getModeProgress(): Record<LearningModeId, ModeProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MODE_PROGRESS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MODE_PROGRESS, JSON.stringify(DEFAULT_MODE_PROGRESS));
        return DEFAULT_MODE_PROGRESS;
      }
      return { ...DEFAULT_MODE_PROGRESS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_MODE_PROGRESS;
    }
  }

  static updateModeProgress(
    mode: LearningModeId,
    update: Partial<ModeProgress>
  ): Record<LearningModeId, ModeProgress> {
    const all = this.getModeProgress();
    all[mode] = { ...all[mode], ...update };
    try {
      localStorage.setItem(STORAGE_KEYS.MODE_PROGRESS, JSON.stringify(all));
    } catch (e) {
      console.error('Failed saving mode progress', e);
    }
    return all;
  }

  static getTopicProgress(): Record<string, TopicProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(DEFAULT_TOPIC_PROGRESS));
        return DEFAULT_TOPIC_PROGRESS;
      }
      return { ...DEFAULT_TOPIC_PROGRESS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_TOPIC_PROGRESS;
    }
  }

  static updateTopicProgress(topic: string, isCorrect: boolean): void {
    const all = this.getTopicProgress();
    const existing = all[topic] || {
      topic,
      mastery_score: 50,
      attempts: 0,
      correct: 0,
      mistakes: 0,
      last_seen: new Date().toISOString(),
      confidence: 50,
    };

    existing.attempts += 1;
    existing.last_seen = new Date().toISOString();
    if (isCorrect) {
      existing.correct += 1;
      // Rolling bump up
      existing.mastery_score = Math.min(100, Math.round(existing.mastery_score * 0.8 + 100 * 0.2));
      existing.confidence = Math.min(100, existing.confidence + 5);
    } else {
      existing.mistakes += 1;
      // Rolling drop
      existing.mastery_score = Math.max(0, Math.round(existing.mastery_score * 0.8 + 30 * 0.2));
      existing.confidence = Math.max(10, existing.confidence - 8);
    }

    all[topic] = existing;
    try {
      localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(all));
    } catch (e) {
      console.error('Failed saving topic progress', e);
    }
  }

  static getMistakes(): MistakeRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKE_RECORDS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MISTAKE_RECORDS, JSON.stringify(DEFAULT_MISTAKES));
        return DEFAULT_MISTAKES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_MISTAKES;
    }
  }

  static saveMistakes(mistakes: MistakeRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MISTAKE_RECORDS, JSON.stringify(mistakes));
    } catch (e) {
      console.error('Failed saving mistakes', e);
    }
  }

  static recordMistake(topic: string, mistakeType: string, description: string, example = ''): void {
    const mistakes = this.getMistakes();
    const existing = mistakes.find(m => m.topic === topic && m.mistake_type === mistakeType);
    if (existing) {
      existing.occurrences += 1;
      existing.last_seen = new Date().toISOString();
      existing.resolved = false;
      existing.consecutive_successes = 0;
      if (example) existing.example = example;
    } else {
      mistakes.push({
        id: `mstk-${Date.now()}`,
        topic,
        mistake_type: mistakeType,
        description,
        example,
        occurrences: 1,
        last_seen: new Date().toISOString(),
        resolved: false,
        consecutive_successes: 0,
      });
    }
    this.saveMistakes(mistakes);
  }

  static recordMistakeSuccess(topic: string, mistakeType: string): void {
    const mistakes = this.getMistakes();
    const target = mistakes.find(m => m.topic === topic && m.mistake_type === mistakeType);
    if (target && !target.resolved) {
      target.consecutive_successes = (target.consecutive_successes || 0) + 1;
      // Resolve after 2 consecutive correct demonstrations across exercises
      if (target.consecutive_successes >= 2) {
        target.resolved = true;
      }
      this.saveMistakes(mistakes);
    }
  }

  static logEvent(event: Omit<LearningEvent, 'id' | 'timestamp'>): void {
    try {
      const events: LearningEvent[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LEARNING_EVENTS) || '[]'
      );
      events.push({
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...event,
      });
      // Keep last 100 events
      if (events.length > 100) events.shift();
      localStorage.setItem(STORAGE_KEYS.LEARNING_EVENTS, JSON.stringify(events));
    } catch {
      // ignore
    }
  }

  static getSavedCode(exerciseId: string): string | null {
    try {
      const map = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_CODE) || '{}');
      return map[exerciseId] || null;
    } catch {
      return null;
    }
  }

  static saveCode(exerciseId: string, code: string): void {
    try {
      const map = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_CODE) || '{}');
      map[exerciseId] = code;
      localStorage.setItem(STORAGE_KEYS.SAVED_CODE, JSON.stringify(map));
    } catch {
      // ignore
    }
  }

  static getCustomApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  }

  static setCustomApiKey(key: string): void {
    if (!key) {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    } else {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
    }
  }

  static resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.MODE_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.TOPIC_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.MISTAKE_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.LEARNING_EVENTS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_CODE);
  }
}
