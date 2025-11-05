import BackgroundTimer from 'react-native-background-timer';
import { useTimerStore } from './timerStore';

let intervalId: number | null = null;

export const startBackgroundTimer = (duration: number, onComplete?: () => void) => {
  const { startTimer, decrement } = useTimerStore.getState();
  console.log('datafirst',onComplete);
  startTimer(duration, onComplete);

  if (intervalId) {
    BackgroundTimer.clearInterval(intervalId);
  }

  intervalId = BackgroundTimer.setInterval(() => {
    const { isRunning, isPaused } = useTimerStore.getState();
    if (isRunning && !isPaused) {
      decrement();
    }
  }, 1000);
};

export const pauseBackgroundTimer = () => {
  useTimerStore.getState().pauseTimer();
};

export const resumeBackgroundTimer = () => {
  useTimerStore.getState().resumeTimer();
};

export const restartBackgroundTimer = () => {
  useTimerStore.getState().restartTimer();
};

export const stopBackgroundTimer = () => {
  useTimerStore.getState().stopTimer();
  if (intervalId) {
    BackgroundTimer.clearInterval(intervalId);
    intervalId = null;
  }
};
