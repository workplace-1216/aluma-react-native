import { create } from 'zustand';

type TimerState = {
  initialDuration: number
  timeLeft: number
  isRunning: boolean
  isPaused: boolean
  onComplete?: () => void // optional callback

  startTimer: (duration: number, onComplete?: () => void) => void
  pauseTimer: () => void
  resumeTimer: () => void
  restartTimer: () => void
  stopTimer: () => void
  decrement: () => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  initialDuration: 0,
  timeLeft: 0,
  isRunning: false,
  isPaused: false,
  onComplete: undefined,

  startTimer: (duration: number, onComplete?: () => void) => {
    set({
      initialDuration: duration,
      timeLeft: duration,
      isRunning: true,
      isPaused: false,
      onComplete,
    });
  },

  pauseTimer: () => {
    set({ isPaused: true, isRunning: false });
  },

  resumeTimer: () => {
    if (get().timeLeft > 0) {
      set({ isPaused: false, isRunning: true });
    }
  },

  restartTimer: () => {
    const { initialDuration } = get();
    set({ timeLeft: initialDuration, isRunning: true, isPaused: false });
  },

  stopTimer: () => {
    set({ isRunning: false, isPaused: false, timeLeft: 0, initialDuration: 0, onComplete: undefined });
  },

  decrement: () => {
    const { timeLeft, isRunning, isPaused, onComplete } = get();
    if (isRunning && !isPaused && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
      if (timeLeft - 1 <= 0) {
        set({ isRunning: false, isPaused: false });
        console.log(onComplete);
        if (onComplete) {
          onComplete();
          set({ onComplete: undefined }); // clear callback after firing
        }
      }
    }
  },
}));
