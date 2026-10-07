import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SubtitleBanner } from './components/SubtitleBanner';
import { HomeScreen } from './components/screens/HomeScreen';
import { GuideScreen } from './components/screens/GuideScreen';
import { GameplayScreen } from './components/screens/GameplayScreen';
import { ApplicationScreen } from './components/screens/ApplicationScreen';
import { SummaryScreen } from './components/screens/SummaryScreen';
import { Team, ScoreRecord } from './types';
import { soundFx } from './utils/sound';
import { narrator } from './utils/audioNarrator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'guide' | 'gameplay' | 'application' | 'summary'
  >('home');

  const [teamNames, setTeamNames] = useState<string[]>([
    'Đội 1',
    'Đội 2',
    'Đội 3',
    'Đội 4',
  ]);

  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Đội 1', score: 0 },
    { id: 2, name: 'Đội 2', score: 0 },
    { id: 3, name: 'Đội 3', score: 0 },
    { id: 4, name: 'Đội 4', score: 0 },
  ]);

  const [unlockedLocks, setUnlockedLocks] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const [currentLock, setCurrentLock] = useState<number>(1);

  const [scoreRecords, setScoreRecords] = useState<
    Record<number, Record<number, ScoreRecord>>
  >({
    1: { 1: { correct: false, bonus: false }, 2: { correct: false, bonus: false }, 3: { correct: false, bonus: false }, 4: { correct: false, bonus: false } },
    2: { 1: { correct: false, bonus: false }, 2: { correct: false, bonus: false }, 3: { correct: false, bonus: false }, 4: { correct: false, bonus: false } },
    3: { 1: { correct: false, bonus: false }, 2: { correct: false, bonus: false }, 3: { correct: false, bonus: false }, 4: { correct: false, bonus: false } },
    4: { 1: { correct: false, bonus: false }, 2: { correct: false, bonus: false }, 3: { correct: false, bonus: false }, 4: { correct: false, bonus: false } },
  });

  const [scoresLockedForCurrentStep, setScoresLockedForCurrentStep] = useState<boolean>(false);
  const [activeDiscourseViewIndex, setActiveDiscourseViewIndex] = useState<number | null>(null);
  const [applicationResponse, setApplicationResponse] = useState<string>('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Subscribe to voice state for reactive UI updates
  useEffect(() => {
    return narrator.subscribe((st) => {
      setSpeakingId(st.isPlaying ? st.activeId : null);
    });
  }, []);

  // Update team names in teams state
  const handleTeamNameChange = (index: number, newName: string) => {
    const updatedNames = [...teamNames];
    updatedNames[index] = newName;
    setTeamNames(updatedNames);

    setTeams((prev) =>
      prev.map((t, idx) => (idx === index ? { ...t, name: newName || `Đội ${idx + 1}` } : t))
    );
  };

  // Score record toggle
  const handleUpdateScoreRecord = (
    teamId: number,
    field: 'correct' | 'bonus',
    value: boolean
  ) => {
    setScoreRecords((prev) => {
      const stepRecords = { ...prev[currentLock] };
      stepRecords[teamId] = {
        ...stepRecords[teamId],
        [field]: value,
      };
      return {
        ...prev,
        [currentLock]: stepRecords,
      };
    });
  };

  // Confirm scores for the current step
  const handleConfirmScores = () => {
    const stepRecords = scoreRecords[currentLock];

    setTeams((prevTeams) => {
      return prevTeams.map((team) => {
        const rec = stepRecords[team.id];
        let stepScore = 0;
        if (rec.correct) stepScore += 10;
        if (rec.bonus) stepScore += 5;

        // Calculate score sum across all locks
        let total = 0;
        for (let l = 1; l <= 4; l++) {
          const r = l === currentLock ? rec : scoreRecords[l]?.[team.id];
          if (r?.correct) total += 10;
          if (r?.bonus) total += 5;
        }
        return { ...team, score: total };
      });
    });

    setScoresLockedForCurrentStep(true);
    soundFx.playCorrectChime();
  };

  const handleEditScores = () => {
    setScoresLockedForCurrentStep(false);
  };

  // Complete and unlock the step
  const handleUnlockCurrentStep = () => {
    soundFx.playUnlockChord();
    setUnlockedLocks((prev) => {
      const next = [...prev];
      next[currentLock - 1] = true;
      return next;
    });
    setActiveDiscourseViewIndex(currentLock - 1);
  };

  // Next step transition
  const handleNextStep = () => {
    if (currentLock < 4) {
      setCurrentLock((prev) => prev + 1);
      setScoresLockedForCurrentStep(false);
    } else {
      document.body.classList.add('stage-golden-glow');
      setCurrentScreen('application');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigation helper
  const handleNavigate = (screen: 'home' | 'guide' | 'gameplay' | 'application' | 'summary') => {
    narrator.stop();
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset entire game
  const handleRestart = () => {
    narrator.stop();
    document.body.classList.remove('stage-golden-glow');
    setCurrentLock(1);
    setUnlockedLocks([false, false, false, false]);
    setActiveDiscourseViewIndex(null);
    setScoresLockedForCurrentStep(false);
    setApplicationResponse('');
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    setScoreRecords({
      1: { 1: { correct: false, bonus: false }, 2: { correct: false, bonus: false }, 3: { correct: false, bonus: false }, 4: { correct: false, bonus: false } },
      2: { 1: { correct: false, bonus: false }, 2: { correct: false, bonus: false }, 3: { correct: false, bonus: false }, 4: { correct: false, bonus: false } },
      3: { 1: { correct: false, bonus: false }, 2: { correct: false, bonus: false }, 3: { correct: false, bonus: false }, 4: { correct: false, bonus: false } },
      4: { 1: { correct: false, bonus: false }, 2: { correct: false, bonus: false }, 3: { correct: false, bonus: false }, 4: { correct: false, bonus: false } },
    });
    setCurrentScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[#27272a]">
      {/* Theatrical Curtains & Spotlight background */}
      <div className="stage-curtains" />
      <div className="stage-spotlight" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4 pb-24 flex-1 flex flex-col">
        <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

        {/* View routing */}
        {currentScreen === 'home' && (
          <HomeScreen
            teamNames={teamNames}
            onTeamNameChange={handleTeamNameChange}
            onStartGame={() => handleNavigate('gameplay')}
            onOpenGuide={() => handleNavigate('guide')}
            speakingId={speakingId}
          />
        )}

        {currentScreen === 'guide' && (
          <GuideScreen
            onBack={() => handleNavigate(unlockedLocks.some(Boolean) ? 'gameplay' : 'home')}
            speakingId={speakingId}
          />
        )}

        {currentScreen === 'gameplay' && (
          <GameplayScreen
            teams={teams}
            unlockedLocks={unlockedLocks}
            currentLock={currentLock}
            scoreRecords={scoreRecords}
            scoresLockedForCurrentStep={scoresLockedForCurrentStep}
            activeDiscourseViewIndex={activeDiscourseViewIndex}
            speakingId={speakingId}
            onUpdateScoreRecord={handleUpdateScoreRecord}
            onConfirmScores={handleConfirmScores}
            onEditScores={handleEditScores}
            onUnlockCurrentStep={handleUnlockCurrentStep}
            onNextStep={handleNextStep}
            onSelectUnlockedDiscourse={(idx) => setActiveDiscourseViewIndex(idx)}
          />
        )}

        {currentScreen === 'application' && (
          <ApplicationScreen
            response={applicationResponse}
            onResponseChange={setApplicationResponse}
            onFinish={() => handleNavigate('summary')}
            speakingId={speakingId}
          />
        )}

        {currentScreen === 'summary' && (
          <SummaryScreen
            teams={teams}
            applicationResponse={applicationResponse}
            onHome={() => handleNavigate('home')}
            onRestart={handleRestart}
            speakingId={speakingId}
          />
        )}
      </div>

      {/* Floating Subtitle Teleprompter Banner */}
      <SubtitleBanner />
    </div>
  );
}
