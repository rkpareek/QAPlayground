import React, { useState, useEffect } from 'react';
import {
  LearningModeId,
  UserProfile,
  ModeProgress,
  TopicProgress,
  MistakeRecord,
  GeneratedExercise,
  EvaluationResult,
  CodeEvaluationResult,
  LogicEvaluationResult,
} from './types';
import { ProfileManager } from './engine/profileManager';
import { ProficiencyEngine } from './engine/proficiencyEngine';
import { AdaptiveEngine } from './engine/adaptiveEngine';
import { GeminiClient } from './services/geminiClient';
import { ProgressHeader } from './components/shared/ProgressHeader';
import { SettingsModal } from './components/shared/SettingsModal';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { QuickThinkWorkspace } from './components/quick-think/QuickThinkWorkspace';
import { CodeLabWorkspace } from './components/code-lab/CodeLabWorkspace';
import { LearnUnderstandWorkspace } from './components/learn-understand/LearnUnderstandWorkspace';
import { PracticalLabWorkspace } from './components/practical-lab/PracticalLabWorkspace';
import { LogicBuilderWorkspace } from './components/logic-builder/LogicBuilderWorkspace';

export const LearnPythonApp: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(ProfileManager.getProfile());
  const [modeProgress, setModeProgress] = useState<Record<LearningModeId, ModeProgress>>(
    ProfileManager.getModeProgress()
  );
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>(
    ProfileManager.getTopicProgress()
  );
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(ProfileManager.getMistakes());

  const [activeMode, setActiveMode] = useState<LearningModeId | null>(null);
  const [currentExercise, setCurrentExercise] = useState<GeneratedExercise | null>(null);
  const [isLoadingExercise, setIsLoadingExercise] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Reload data from storage
  const refreshState = () => {
    setProfile(ProfileManager.getProfile());
    setModeProgress(ProfileManager.getModeProgress());
    setTopicProgress(ProfileManager.getTopicProgress());
    setMistakes(ProfileManager.getMistakes());
  };

  // When a mode is selected, generate or fetch the first exercise adaptively
  const handleSelectMode = async (modeId: LearningModeId) => {
    setActiveMode(modeId);
    await loadNextExercise(modeId);
  };

  const loadNextExercise = async (modeId: LearningModeId) => {
    setIsLoadingExercise(true);
    try {
      const rec = AdaptiveEngine.getNextRecommendation(modeId);
      const ex = await GeminiClient.generateExercise(
        modeId,
        rec.difficulty,
        rec.topic,
        rec.focusMisconception
      );
      setCurrentExercise(ex);
      ProfileManager.logEvent({
        type: 'question_generated',
        mode: modeId,
        topic: ex.topic,
        details: { difficulty: ex.difficulty, title: ex.title },
      });
    } catch (e) {
      console.error('Failed to load exercise', e);
    } finally {
      setIsLoadingExercise(false);
    }
  };

  // Outcome handler for Quick Think
  const handleQuickThinkAnswer = (
    isCorrect: boolean,
    hintsUsed: number,
    attempts: number,
    evalResult: EvaluationResult
  ) => {
    if (!currentExercise) return;

    // 1. Update topic progress
    ProfileManager.updateTopicProgress(currentExercise.topic, isCorrect);

    // 2. Update mode progress
    const currentMode = modeProgress.M;
    const newScore = ProficiencyEngine.computeNewScore(
      currentMode.score,
      isCorrect,
      hintsUsed,
      attempts,
      currentExercise.difficulty
    );
    const updatedAttempts = currentMode.questions_attempted + 1;
    const updatedCorrect = currentMode.questions_correct + (isCorrect ? 1 : 0);
    const updatedAccuracy = Math.round((updatedCorrect / updatedAttempts) * 100);

    const updatedModes = ProfileManager.updateModeProgress('M', {
      score: newScore,
      accuracy: updatedAccuracy,
      questions_attempted: updatedAttempts,
      questions_correct: updatedCorrect,
    });

    // 3. Update overall user profile
    const overallScore = ProficiencyEngine.computeOverallScore(updatedModes);
    const updatedProfile: UserProfile = {
      ...profile,
      overall_score: overallScore,
      total_questions: profile.total_questions + 1,
      total_correct: profile.total_correct + (isCorrect ? 1 : 0),
      total_attempts: profile.total_attempts + attempts,
    };
    ProfileManager.saveProfile(updatedProfile);

    // 4. If correct and this tested a known mistake, log resolution
    if (isCorrect) {
      ProfileManager.recordMistakeSuccess(currentExercise.topic, 'general');
    }

    refreshState();
  };

  // Outcome handler for Code Lab & Practical Lab
  const handleCodeOutcome = (
    mode: LearningModeId,
    isCorrect: boolean,
    hintsUsed: number,
    attempts: number,
    evalResult: CodeEvaluationResult
  ) => {
    if (!currentExercise) return;

    ProfileManager.updateTopicProgress(currentExercise.topic, isCorrect);

    const currentMode = modeProgress[mode];
    const newScore = ProficiencyEngine.computeNewScore(
      currentMode.score,
      isCorrect,
      hintsUsed,
      attempts,
      currentExercise.difficulty
    );
    const updatedAttempts = currentMode.questions_attempted + 1;
    const updatedCorrect = currentMode.questions_correct + (isCorrect ? 1 : 0);
    const updatedAccuracy = Math.round((updatedCorrect / updatedAttempts) * 100);

    const updatedModes = ProfileManager.updateModeProgress(mode, {
      score: newScore,
      accuracy: updatedAccuracy,
      questions_attempted: updatedAttempts,
      questions_correct: updatedCorrect,
    });

    const overallScore = ProficiencyEngine.computeOverallScore(updatedModes);
    ProfileManager.saveProfile({
      ...profile,
      overall_score: overallScore,
      total_questions: profile.total_questions + 1,
      total_correct: profile.total_correct + (isCorrect ? 1 : 0),
      total_attempts: profile.total_attempts + attempts,
    });

    refreshState();
  };

  // Outcome handler for Logic Builder
  const handleLogicOutcome = (
    isCorrect: boolean,
    hintsUsed: number,
    attempts: number,
    evalResult: LogicEvaluationResult
  ) => {
    if (!currentExercise) return;

    ProfileManager.updateTopicProgress(currentExercise.topic, isCorrect);

    const currentMode = modeProgress.E;
    const newScore = ProficiencyEngine.computeNewScore(
      currentMode.score,
      isCorrect,
      hintsUsed,
      attempts,
      currentExercise.difficulty
    );
    const updatedAttempts = currentMode.questions_attempted + 1;
    const updatedCorrect = currentMode.questions_correct + (isCorrect ? 1 : 0);
    const updatedAccuracy = Math.round((updatedCorrect / updatedAttempts) * 100);

    const updatedModes = ProfileManager.updateModeProgress('E', {
      score: newScore,
      accuracy: updatedAccuracy,
      questions_attempted: updatedAttempts,
      questions_correct: updatedCorrect,
    });

    const overallScore = ProficiencyEngine.computeOverallScore(updatedModes);
    ProfileManager.saveProfile({
      ...profile,
      overall_score: overallScore,
      total_questions: profile.total_questions + 1,
      total_correct: profile.total_correct + (isCorrect ? 1 : 0),
      total_attempts: profile.total_attempts + attempts,
    });

    refreshState();
  };

  const handleBackToDashboard = () => {
    setActiveMode(null);
    setCurrentExercise(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <ProgressHeader
        currentMode={activeMode}
        profile={profile}
        onBackToDashboard={handleBackToDashboard}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!activeMode && (
          <HomeDashboard
            profile={profile}
            modeProgress={modeProgress}
            topicProgress={topicProgress}
            mistakes={mistakes}
            onSelectMode={handleSelectMode}
          />
        )}

        {activeMode && (
          <div>
            {isLoadingExercise && (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <span className="text-xs font-mono">
                  Loading adaptive challenge for {activeMode}...
                </span>
              </div>
            )}

            {!isLoadingExercise && currentExercise && (
              <div>
                {activeMode === 'M' && (
                  <QuickThinkWorkspace
                    exercise={currentExercise}
                    onAnswerSubmitted={handleQuickThinkAnswer}
                    onNextExercise={() => loadNextExercise('M')}
                    isLoadingNew={isLoadingExercise}
                  />
                )}

                {activeMode === 'L' && (
                  <CodeLabWorkspace
                    exercise={currentExercise}
                    onCodeEvaluated={(isCorrect, hints, atts, res) =>
                      handleCodeOutcome('L', isCorrect, hints, atts, res)
                    }
                    onNextExercise={() => loadNextExercise('L')}
                  />
                )}

                {activeMode === 'T' && (
                  <LearnUnderstandWorkspace
                    exercise={currentExercise}
                    onStepCompleted={() => {
                      ProfileManager.updateTopicProgress(currentExercise.topic, true);
                      refreshState();
                    }}
                    onNextExercise={() => loadNextExercise('T')}
                  />
                )}

                {activeMode === 'P' && (
                  <PracticalLabWorkspace
                    exercise={currentExercise}
                    onCodeEvaluated={(isCorrect, hints, atts, res) =>
                      handleCodeOutcome('P', isCorrect, hints, atts, res)
                    }
                    onNextExercise={() => loadNextExercise('P')}
                  />
                )}

                {activeMode === 'E' && (
                  <LogicBuilderWorkspace
                    exercise={currentExercise}
                    onLogicEvaluated={handleLogicOutcome}
                    onNextExercise={() => loadNextExercise('E')}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataReset={refreshState}
      />
    </div>
  );
};
