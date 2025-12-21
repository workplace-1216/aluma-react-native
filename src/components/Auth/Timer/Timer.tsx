import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { styles } from './styles';
import { Text } from 'react-native';
interface TimerProps {
  isActive: boolean;
  seconds: number;
  setSeconds: Dispatch<SetStateAction<number>>;
  stopTimer: () => void;
}

const formatSeconds = (secs: number) => {
  const pad = (n: number) => (n < 10 ? `0${n}` : n);

  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs / 60) - h * 60;
  const s = Math.floor(secs - h * 3600 - m * 60);

  return `${pad(m)}:${pad(s)}`;
};

const Timer = ({ isActive, seconds, setSeconds, stopTimer }: TimerProps) => {
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds == 0) {
            clearInterval(interval);
            stopTimer();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, setSeconds]);
  return (
    <Text style={styles.TimerTextStyle}>{formatSeconds(seconds)}</Text>
  );
};

export default Timer;
