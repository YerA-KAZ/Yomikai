import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PetTheme = 'cat' | 'dog';
export type ColorMode = 'light' | 'dark';

interface ThemeState {
  petTheme: PetTheme;
  colorMode: ColorMode;
  setPetTheme: (theme: PetTheme) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      petTheme: 'cat',
      colorMode: 'dark',
      setPetTheme: (petTheme) => set({ petTheme }),
      setColorMode: (colorMode) => set({ colorMode }),
      toggleColorMode: () =>
        set((state) => ({ colorMode: state.colorMode === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'yomikai-theme' }
  )
);
