import BackgroundTimer from 'react-native-background-timer';
import { useTimerStore } from './timerStore';

let intervalId: number | null = null;

export const startSleepBackgroundTimer = (duration: number, onComplete?: () => void) => {
  const { startTimer, decrement } = useTimerStore.getState();
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

export const pauseSleepBackgroundTimer = () => {
  useTimerStore.getState().pauseTimer();
};

export const resumeSleepBackgroundTimer = () => {
  useTimerStore.getState().resumeTimer();
};

export const restartSleepBackgroundTimer = () => {
  useTimerStore.getState().restartTimer();
};

export const stopSleepBackgroundTimer = () => {
  useTimerStore.getState().stopTimer();
  if (intervalId) {
    BackgroundTimer.clearInterval(intervalId);
    intervalId = null;
  }
};
