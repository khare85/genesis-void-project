
import { useState } from 'react';
import { ScreeningCandidate, ScreeningState } from '@/types/screening';

export const useAIScreening = () => {
  const [screeningState, setScreeningState] = useState<ScreeningState>('idle');
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [candidatesToScreen, setCandidatesToScreen] = useState<ScreeningCandidate[]>([]);

  return {
    screeningState,
    setScreeningState,
    screeningProgress,
    setScreeningProgress,
    candidatesToScreen,
    setCandidatesToScreen
  };
};
