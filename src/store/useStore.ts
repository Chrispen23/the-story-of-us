import { create } from 'zustand';

type Act = 'loading' | 'prologue' | 'act1' | 'act2' | 'act3' | 'act4' | 'payoff';

interface StoreState {
  currentAct: Act;
  narrativeStep: number;
  audioStarted: boolean;
  
  // Actions
  setAct: (act: Act) => void;
  nextStep: () => void;
  setStep: (step: number) => void;
  startAudio: () => void;
}

export const useStore = create<StoreState>((set) => ({
  currentAct: 'loading',
  narrativeStep: 0,
  audioStarted: false,
  
  setAct: (act) => set({ currentAct: act, narrativeStep: 0 }),
  nextStep: () => set((state) => ({ narrativeStep: state.narrativeStep + 1 })),
  setStep: (step) => set({ narrativeStep: step }),
  startAudio: () => set({ audioStarted: true }),
}));
