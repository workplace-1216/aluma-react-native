import {useEffect, useState} from 'react';
import {useTimerStore} from './timerStore';

export const useSleepCountdown = () => {
  const timeLeft = useTimerStore(state => state.timeLeft);
  const isRunning = useTimerStore(state => state.isRunning);
  const isPaused = useTimerStore(state => state.isPaused);
  const initialDuration = useTimerStore(state => state.initialDuration);

  const [displayTime, setDisplayTime] = useState(timeLeft);

  useEffect(() => {
    setDisplayTime(timeLeft);
  }, [timeLeft]);

  return {
    timeLeft: displayTime,
    isRunning,
    isPaused,
    minutes: Math.floor(displayTime / 60),
    seconds: displayTime % 60,
    initialDuration,
    elapsedSeconds: Math.max(0, initialDuration - displayTime),

    // Controls exposed as callbacks
    pause: () => useTimerStore.getState().pauseTimer(),
    resume: () => useTimerStore.getState().resumeTimer(),
    restart: () => useTimerStore.getState().restartTimer(),
    stop: () => useTimerStore.getState().stopTimer(),
  };
};
