export type LearningModeId = 'M' | 'L' | 'T' | 'P' | 'E';

export interface ModeMeta {
  id: LearningModeId;
  name: string;
  tagline: string;
  description: string;
  color: string;
  accentClass: string;
  iconName: string;
}

export const LEARNING_MODES: Record<LearningModeId, ModeMeta> = {
  M: {
    id: 'M',
    name: 'Quick Think',
    tagline: '5-minute mental Python reps',
    description: 'Fast mental/mobile-style practice: output prediction, MCQs, state tracing, and tiny logic.',
    color: 'emerald',
    accentClass: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    iconName: 'Zap',
  },
  L: {
    id: 'L',
    name: 'Code Lab',
    tagline: 'Write, run, debug and improve Python',
    description: 'Full Python coding practice with deterministic test runner, sandbox execution, and code quality critiques.',
    color: 'indigo',
    accentClass: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
    iconName: 'Code2',
  },
  T: {
    id: 'T',
    name: 'Learn & Understand',
    tagline: 'Interactive Python tutor',
    description: 'Socratic interactive tutor teaching with mental models (references, mutation, scope, loops, calls).',
    color: 'sky',
    accentClass: 'from-sky-500/10 to-cyan-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
    iconName: 'GraduationCap',
  },
  P: {
    id: 'P',
    name: 'Practical Lab',
    tagline: 'Real-world Python problem solving',
    description: 'Short real-world WAPs progressing from basic state tracking to QA log parsing and API data extraction.',
    color: 'amber',
    accentClass: 'from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    iconName: 'Briefcase',
  },
  E: {
    id: 'E',
    name: 'Logic Builder',
    tagline: 'Build algorithms before writing code',
    description: 'Explain algorithmic solutions in plain English before touching syntax: state, conditions, and transitions.',
    color: 'purple',
    accentClass: 'from-purple-500/10 to-fuchsia-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
    iconName: 'BrainCircuit',
  },
};

export interface UserProfile {
  user_id: string;
  created_at: string;
  last_active_at: string;
  overall_level: number;
  overall_score: number;
  current_streak: number;
  total_questions: number;
  total_correct: number;
  total_attempts: number;
}

export interface ModeProgress {
  user_id: string;
  mode: LearningModeId;
  score: number;
  accuracy: number;
  questions_attempted: number;
  questions_correct: number;
  current_level: number;
  highest_level: number;
  average_attempts: number;
}

export interface TopicProgress {
  topic: string;
  mastery_score: number;
  attempts: number;
  correct: number;
  mistakes: number;
  last_seen: string;
  confidence: number;
}

export interface MistakeRecord {
  id: string;
  topic: string;
  mistake_type: string;
  description: string;
  example: string;
  occurrences: number;
  last_seen: string;
  resolved: boolean;
  consecutive_successes: number;
}

export interface ExerciseAttempt {
  exercise_id: string;
  mode: LearningModeId;
  question: string;
  difficulty: number;
  user_answer: string;
  evaluation: EvaluationResult;
  score: number;
  hints_used: number;
  attempt_number: number;
  timestamp: string;
}

export interface CodeSubmission {
  exercise_id: string;
  code: string;
  execution_output: string;
  execution_error?: string;
  evaluation: CodeEvaluationResult;
  timestamp: string;
}

export type LearningEventType =
  | 'question_generated'
  | 'answer_submitted'
  | 'hint_requested'
  | 'answer_correct'
  | 'answer_incorrect'
  | 'code_executed'
  | 'code_saved'
  | 'concept_taught'
  | 'mistake_detected'
  | 'mistake_resolved'
  | 'level_up';

export interface LearningEvent {
  id: string;
  type: LearningEventType;
  timestamp: string;
  mode?: LearningModeId;
  topic?: string;
  details?: Record<string, any>;
}

export interface GeneratedExercise {
  id: string;
  mode: LearningModeId;
  topic: string;
  difficulty: number;
  title: string;
  question: string;
  code_snippet?: string;
  options?: string[];
  correct_option_index?: number;
  starter_code?: string;
  constraints?: string[];
  expected_concepts: string[];
  common_mistakes?: string[];
  solution_strategy?: string;
  expected_output?: string;
  edge_cases?: string[];
  test_cases?: {
    input?: string;
    expected_output: string;
    description: string;
    hidden?: boolean;
  }[];
  hints: string[];
  qa_focus?: string;
}

export interface CodeEvaluationResult {
  status: 'correct' | 'partial' | 'incorrect';
  score: number;
  logic_score: number;
  code_quality_score: number;
  edge_case_score: number;
  issues: string[];
  strengths: string[];
  mistakes: string[];
  explanation: string;
  hint: string;
  retry_required: boolean;
  next_action: 'retry' | 'reinforce' | 'advance';
}

export interface EvaluationResult {
  status: 'correct' | 'partial' | 'incorrect';
  score: number;
  feedback: string;
  misconception?: string;
  suggested_hint?: string;
  improvement_tip?: string;
  retry_required: boolean;
  next_action: 'retry' | 'reinforce' | 'advance';
}

export interface LogicEvaluationResult {
  status: 'correct' | 'partial' | 'incorrect';
  score: number;
  state_tracking_score: number;
  conditions_score: number;
  transitions_score: number;
  edge_case_score: number;
  identified_states: string[];
  missing_elements: string[];
  strengths: string[];
  critique: string;
  suggested_hint: string;
  optional_pseudocode?: string;
  optional_python_translation?: string;
  retry_required: boolean;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs: number;
  testResults?: {
    description: string;
    passed: boolean;
    actual: string;
    expected: string;
  }[];
}
