import { create } from 'zustand';

interface StoreState {
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  chapter: number;
  setChapter: (chapter: number) => void;
  scrollEnabled: boolean;
  setScrollEnabled: (enabled: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  chapter: 0,
  setChapter: (chapter) => set({ chapter }),
  scrollEnabled: false,
  setScrollEnabled: (enabled) => set({ scrollEnabled: enabled }),
}));
