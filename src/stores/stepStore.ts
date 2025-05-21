import { create } from "zustand";

export type GameStep = "home" | "profiles" | "categories" | "game";

interface StepState {
  step: GameStep;
  setStep: (step: GameStep) => void;
}

export const useStepStore = create<StepState>()((set, get) => ({
  step: "home",

  setStep(step: GameStep) {
    if (step !== get().step) {
      set({ step });
    }
  },
}));
