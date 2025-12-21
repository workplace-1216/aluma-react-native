import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {breathWorkTimerDefault, breathWorkTimerOptions} from '../../constants/sleepTimer';
import {formatSeconds} from '../../utils/formatSeconds';
import Sound from 'react-native-sound';

type BreathworkTimerControllerProps = {
  isModalVisible: boolean;
  onFinishExercise: () => void;
};

const CYCLE_IMMEDIATE_THRESHOLD_MS = 300;
const stopAudioAsset = require('../../assets/music/stopaudio.mp3');

const playStopTone = () => {
  const sound = new Sound(stopAudioAsset, error => {
    if (error) {
      return;
    }
    sound.play(() => {
      sound.release();
    });
  });
};

export const useBreathworkTimerController = ({
  isModalVisible,
  onFinishExercise,
}: BreathworkTimerControllerProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endAtRef = useRef<number | null>(null);
  const finishScheduledRef = useRef(false);
  const finishTriggeredRef = useRef(false);
  const lastCycleCompleteTimeRef = useRef<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    breathWorkTimerDefault,
  );
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const clearIntervalLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopCountdown = useCallback(() => {
    clearIntervalLoop();
    endAtRef.current = null;
    setIsTimerActive(false);
    setRemainingSeconds(0);
  }, [clearIntervalLoop]);

  const cancelTimer = useCallback(() => {
    stopCountdown();
    finishScheduledRef.current = false;
    finishTriggeredRef.current = false;
  }, [stopCountdown]);

  const triggerFinish = useCallback(() => {
    if (finishTriggeredRef.current) {
      return;
    }
    finishTriggeredRef.current = true;
    finishScheduledRef.current = false;
    playStopTone();
    onFinishExercise();
  }, [onFinishExercise]);
  useEffect(() => {
    if (isModalVisible) {
      setSelectedValue(breathWorkTimerDefault);
    }
  }, [isModalVisible]);

  useEffect(() => {
    return () => {
      cancelTimer();
    };
  }, [cancelTimer]);

  const handleTimerCompleted = useCallback(() => {
    stopCountdown();
    const now = Date.now();
    const lastComplete = lastCycleCompleteTimeRef.current ?? 0;
    const justCompleted =
      lastCycleCompleteTimeRef.current !== null &&
      now - lastComplete <= CYCLE_IMMEDIATE_THRESHOLD_MS;

    if (justCompleted) {
      triggerFinish();
      return;
    }

    finishScheduledRef.current = true;
  }, [stopCountdown, triggerFinish]);

  const updateRemaining = useCallback(() => {
    const endAt = endAtRef.current;
    if (!endAt) {
      return;
    }
    const diffMs = endAt - Date.now();
    if (diffMs <= 0) {
      handleTimerCompleted();
      return;
    }
    const diffSec = Math.ceil(diffMs / 1000);
    setRemainingSeconds(Math.max(0, diffSec));
  }, [handleTimerCompleted]);

  const startTimer = useCallback(() => {
    finishScheduledRef.current = false;
    finishTriggeredRef.current = false;
    const minutes = Number(selectedValue ?? breathWorkTimerDefault);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return;
    }

    const durationMs = minutes * 60 * 1000;
    endAtRef.current = Date.now() + durationMs;
    setIsTimerActive(true);
    setRemainingSeconds(minutes * 60);
    clearIntervalLoop();

    intervalRef.current = setInterval(() => {
      updateRemaining();
    }, 1000);
  }, [selectedValue, updateRemaining, clearIntervalLoop]);

  const onPrimaryAction = useCallback(() => {
    if (isTimerActive) {
      cancelTimer();
      return;
    }

    startTimer();
  }, [isTimerActive, cancelTimer, startTimer]);

  const onSelectValue = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  const remainingText = useMemo(() => {
    if (!isTimerActive) {
      return undefined;
    }
    return formatSeconds(remainingSeconds);
  }, [isTimerActive, remainingSeconds]);

  const primaryButtonLabel = isTimerActive ? 'Stop' : 'Start';
  const handleCycleComplete = useCallback(() => {
    lastCycleCompleteTimeRef.current = Date.now();
    if (finishScheduledRef.current) {
      finishScheduledRef.current = false;
      triggerFinish();
    }
  }, [triggerFinish]);

  return {
    options: breathWorkTimerOptions,
    selectedValue,
    onSelectValue,
    isTimerActive,
    remainingText,
    primaryButtonLabel,
    onPrimaryAction,
    onCycleComplete: handleCycleComplete,
  };
};
