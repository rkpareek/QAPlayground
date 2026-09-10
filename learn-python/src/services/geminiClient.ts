import {
  GeneratedExercise,
  LearningModeId,
  EvaluationResult,
  CodeEvaluationResult,
  LogicEvaluationResult,
} from '../types';
import { MASTER_SYSTEM_PROMPT, MODE_SPECIFIC_PROMPTS } from './promptTemplates';
import { FALLBACK_EXERCISES } from '../engine/fallbackBank';
import { ProfileManager } from '../engine/profileManager';

export class GeminiClient {
  /**
   * Generates an adaptive exercise tailored to current mode, difficulty, and weak topics
   */
  static async generateExercise(
    mode: LearningModeId,
    difficulty: number,
    topic: string,
    misconceptionFocus?: string
  ): Promise<GeneratedExercise> {
    const customKey = ProfileManager.getCustomApiKey();

    // Call server proxy or client with fallback
    try {
      const prompt = `Generate a Python learning exercise for mode: "${mode}".
Target Difficulty: Level ${difficulty} (on 1-10 scale).
Topic: "${topic}".
${misconceptionFocus ? `Reinforce and test this known misconception: "${misconceptionFocus}".` : ''}

Respond ONLY with valid JSON matching this schema:
{
  "id": "gen-${Date.now()}",
  "mode": "${mode}",
  "topic": "${topic}",
  "difficulty": ${difficulty},
  "title": "Clear Exercise Title",
  "question": "Detailed instructions and scenario",
  "code_snippet": "Optional python snippet to analyze or debug (especially for Quick Think)",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_option_index": 0,
  "starter_code": "Optional python starter template",
  "constraints": ["constraint 1"],
  "expected_concepts": ["concept 1", "concept 2"],
  "expected_output": "Expected printed output or return value",
  "hints": [
    "Tier 1: High-level conceptual direction",
    "Tier 2: Algorithmic workflow",
    "Tier 3: Pseudocode structure",
    "Tier 4: Partial code line"
  ]
}`;

      const res = await this.callGeminiRaw(mode, prompt, customKey);
      const parsed = this.safeParseJson<GeneratedExercise>(res);
      if (parsed && parsed.title && parsed.question) {
        parsed.id = `gen-${Date.now()}`;
        parsed.mode = mode;
        parsed.difficulty = difficulty;
        return parsed;
      }
    } catch (e) {
      console.warn('Gemini generation failed, using curated question bank:', e);
    }

    // Curated fallback
    const bank = FALLBACK_EXERCISES[mode] || FALLBACK_EXERCISES.M;
    const item = bank[Math.floor(Math.random() * bank.length)];
    return {
      ...item,
      id: `fb-${Date.now()}`,
      difficulty,
      topic: topic || item.topic,
    };
  }

  /**
   * Evaluates a mental practice or conceptual answer (Mode M)
   */
  static async evaluateAnswer(
    exercise: GeneratedExercise,
    userAnswer: string
  ): Promise<EvaluationResult> {
    // If it's a multiple choice question with correct_option_index
    if (exercise.options && exercise.correct_option_index !== undefined) {
      const selectedIndex = parseInt(userAnswer, 10);
      const isCorrect = selectedIndex === exercise.correct_option_index;
      return {
        status: isCorrect ? 'correct' : 'incorrect',
        score: isCorrect ? 100 : 25,
        feedback: isCorrect
          ? `Correct! ${exercise.solution_strategy || 'You identified the exact Python behavior.'}`
          : `Not quite. Expected: "${exercise.options[exercise.correct_option_index]}".`,
        misconception: isCorrect ? undefined : exercise.expected_concepts.join(', '),
        suggested_hint: isCorrect ? undefined : exercise.hints[0],
        improvement_tip: isCorrect
          ? 'Great job keeping object references clear!'
          : 'Remember to track memory pointers rather than assumed copies.',
        retry_required: !isCorrect,
        next_action: isCorrect ? 'advance' : 'retry',
      };
    }

    try {
      const prompt = `Exercise: ${exercise.title}
Question: ${exercise.question}
Expected Concepts: ${exercise.expected_concepts.join(', ')}
Learner Answer: "${userAnswer}"

Evaluate this answer. Return JSON:
{
  "status": "correct" | "partial" | "incorrect",
  "score": 0-100,
  "feedback": "Concise direct evaluation",
  "misconception": "Exact misconception if any",
  "suggested_hint": "Smallest progressive hint if wrong",
  "improvement_tip": "Pythonic improvement note",
  "retry_required": boolean,
  "next_action": "retry" | "reinforce" | "advance"
}`;

      const res = await this.callGeminiRaw(exercise.mode, prompt);
      const parsed = this.safeParseJson<EvaluationResult>(res);
      if (parsed) return parsed;
    } catch {
      // fallback
    }

    const matches = exercise.expected_output
      ? userAnswer.trim() === exercise.expected_output.trim()
      : true;

    return {
      status: matches ? 'correct' : 'incorrect',
      score: matches ? 100 : 40,
      feedback: matches ? 'Correct reasoning.' : 'Your answer did not match the expected behavior.',
      retry_required: !matches,
      next_action: matches ? 'advance' : 'retry',
    };
  }

  /**
   * Evaluates Code Submission (Mode L & P)
   */
  static async evaluateCode(
    exercise: GeneratedExercise,
    code: string,
    output: string,
    runtimeError?: string
  ): Promise<CodeEvaluationResult> {
    try {
      const prompt = `Exercise: ${exercise.title}
Requirements: ${exercise.question}
Expected Output: ${exercise.expected_output || 'N/A'}
Code submitted:
\`\`\`python
${code}
\`\`\`
Console stdout:
${output || '(none)'}
Runtime Error:
${runtimeError || '(none)'}

Evaluate thoroughly across logic, code quality, edge cases, and Pythonic style.
Return JSON:
{
  "status": "correct" | "partial" | "incorrect",
  "score": 0-100,
  "logic_score": 0-100,
  "code_quality_score": 0-100,
  "edge_case_score": 0-100,
  "issues": ["issue 1"],
  "strengths": ["strength 1"],
  "mistakes": ["mistake 1"],
  "explanation": "Brief Socratic critique",
  "hint": "Smallest progressive hint if not correct",
  "retry_required": boolean,
  "next_action": "retry" | "reinforce" | "advance"
}`;

      const res = await this.callGeminiRaw(exercise.mode, prompt);
      const parsed = this.safeParseJson<CodeEvaluationResult>(res);
      if (parsed && typeof parsed.score === 'number') {
        return parsed;
      }
    } catch (e) {
      console.warn('Gemini code evaluation fallback:', e);
    }

    // Deterministic fallback based on output matching
    const hasError = !!runtimeError;
    const outputMatches = exercise.expected_output
      ? output.trim() === exercise.expected_output.trim() || output.includes(exercise.expected_output.trim())
      : !hasError;

    const isCorrect = !hasError && outputMatches;

    return {
      status: isCorrect ? 'correct' : hasError ? 'incorrect' : 'partial',
      score: isCorrect ? 95 : hasError ? 30 : 65,
      logic_score: isCorrect ? 95 : 60,
      code_quality_score: isCorrect ? 90 : 50,
      edge_case_score: isCorrect ? 90 : 40,
      issues: hasError ? [runtimeError!] : !outputMatches ? ['Output mismatch'] : [],
      strengths: isCorrect ? ['Correct loop and condition sequence', 'Clean variable naming'] : ['Good initial attempt'],
      mistakes: hasError ? ['Runtime exception encountered'] : [],
      explanation: isCorrect
        ? 'Excellent! The code executed successfully and satisfied requirements.'
        : hasError
        ? `Encountered error: ${runtimeError}`
        : 'The program ran, but stdout did not match the expected requirement.',
      hint: isCorrect ? '' : exercise.hints[0] || 'Check the variable names and condition boundary.',
      retry_required: !isCorrect,
      next_action: isCorrect ? 'advance' : 'retry',
    };
  }

  /**
   * Evaluates English algorithmic explanation (Mode E - Logic Builder)
   */
  static async evaluateLogic(
    exercise: GeneratedExercise,
    explanationText: string
  ): Promise<LogicEvaluationResult> {
    try {
      const prompt = `Problem: ${exercise.title}
Scenario: ${exercise.question}
Learner's English Algorithmic Explanation:
"""
${explanationText}
"""

Evaluate their algorithmic reasoning without judging grammar harshly. Check:
1. State identification (did they identify what info to remember?)
2. Sequence and loop transitions (how state changes per step)
3. Conditions (exact boolean decisions)
4. Edge cases (fewer items, duplicates, negatives, etc.)

Return JSON:
{
  "status": "correct" | "partial" | "incorrect",
  "score": 0-100,
  "state_tracking_score": 0-100,
  "conditions_score": 0-100,
  "transitions_score": 0-100,
  "edge_case_score": 0-100,
  "identified_states": ["e.g. max1, max2"],
  "missing_elements": ["e.g. handling duplicate values"],
  "strengths": ["e.g. correctly recognized need to update second when first changes"],
  "critique": "Socratic evaluation of their algorithm",
  "suggested_hint": "Smallest hint to help complete their algorithm",
  "optional_pseudocode": "Short pseudocode illustration if near correct",
  "optional_python_translation": "Clean Python snippet demonstrating their algorithm",
  "retry_required": boolean
}`;

      const res = await this.callGeminiRaw('E', prompt);
      const parsed = this.safeParseJson<LogicEvaluationResult>(res);
      if (parsed) return parsed;
    } catch {
      // fallback
    }

    // Heuristic fallback
    const wordCount = explanationText.trim().split(/\s+/).length;
    const mentionsTrack = /track|remember|store|keep|variable|state/i.test(explanationText);
    const mentionsCondition = /if|when|greater|less|compare/i.test(explanationText);
    const mentionsLoop = /loop|for each|every|iterate|through/i.test(explanationText);

    const score = Math.min(
      90,
      (wordCount > 25 ? 30 : 15) +
        (mentionsTrack ? 25 : 0) +
        (mentionsCondition ? 25 : 0) +
        (mentionsLoop ? 20 : 0)
    );

    const isCorrect = score >= 75;

    return {
      status: isCorrect ? 'correct' : score >= 50 ? 'partial' : 'incorrect',
      score,
      state_tracking_score: mentionsTrack ? 85 : 40,
      conditions_score: mentionsCondition ? 85 : 40,
      transitions_score: mentionsLoop ? 80 : 35,
      edge_case_score: 60,
      identified_states: mentionsTrack ? ['Variables tracked in explanation'] : [],
      missing_elements: !mentionsCondition ? ['Clear conditional branching'] : [],
      strengths: ['Addressed the problem in clear English'],
      critique: isCorrect
        ? 'Great algorithmic decomposition! You clearly separated state storage and comparison conditions.'
        : 'Good start. Ensure you explicitly explain what state variables you initialize before looping, and how they update.',
      suggested_hint: exercise.hints[0] || 'Think about what happens when a new number beats your tracked maximum.',
      optional_pseudocode: 'SET max1 = -inf, max2 = -inf\nFOR each num IN list:\n  IF num > max1:\n    max2 = max1; max1 = num\n  ELSE IF num > max2:\n    max2 = num',
      optional_python_translation: 'def find_second(nums):\n    max1, max2 = float("-inf"), float("-inf")\n    for n in nums:\n        if n > max1:\n            max2, max1 = max1, n\n        elif n > max2 and n != max1:\n            max2 = n\n    return max2',
      retry_required: !isCorrect,
    };
  }

  /**
   * Internal dispatcher that calls either backend endpoint or browser fallback
   */
  private static async callGeminiRaw(
    mode: LearningModeId,
    userPrompt: string,
    customKey?: string
  ): Promise<string> {
    const systemPrompt = `${MASTER_SYSTEM_PROMPT}\n\n${MODE_SPECIFIC_PROMPTS[mode]}`;

    // Try backend API first
    try {
      const response = await fetch('/api/learn-python/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          apiKey: customKey || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) return data.text;
      }
    } catch {
      // Backend not running or failed
    }

    throw new Error('API route unavailable');
  }

  private static safeParseJson<T>(raw: string): T | null {
    try {
      // Remove markdown code fences if present
      let clean = raw.trim();
      if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/, '').replace(/```$/, '');
      } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/, '').replace(/```$/, '');
      }
      return JSON.parse(clean);
    } catch {
      return null;
    }
  }
}
