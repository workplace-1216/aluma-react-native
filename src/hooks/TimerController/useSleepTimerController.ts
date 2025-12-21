import {useCallback, useEffect, useMemo, useState} from 'react';
import {sleepTimerOptions} from '../../constants/sleepTimer';
import {useSleepCountdown} from '../SleepCountdown/SleepCountdownHook';
import {stopSleepBackgroundTimer} from '../SleepCountdown/backgroundTimerService.ts';
import {formatSeconds} from '../../utils/formatSeconds';

type SleepTimerControllerProps = {
  isModalVisible: boolean;
  handleSelection: (value: string) => void;
};

export const useSleepTimerController = ({
  isModalVisible,
  handleSelection,
}: SleepTimerControllerProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    sleepTimerOptions[0]?.value ?? null,
  );

  useEffect(() => {
    if (isModalVisible) {
      setSelectedValue(sleepTimerOptions[0]?.value ?? null);
    }
  }, [isModalVisible]);

  const {timeLeft, initialDuration, isRunning, isPaused} = useSleepCountdown();
  const isRunningTimer = useMemo(
    () => initialDuration > 0 && (isRunning || isPaused),
    [initialDuration, isRunning, isPaused],
  );
  const remainingText = useMemo(() => {
    if (!isRunningTimer) {
      return undefined;
    }
    return formatSeconds(timeLeft);
  }, [isRunningTimer, timeLeft]);
  const primaryButtonLabel = isRunningTimer ? 'Turn Off Timer' : 'Start';

  const onSelectValue = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  const onPrimaryAction = useCallback(() => {
    if (isRunningTimer) {
      stopSleepBackgroundTimer();
      return;
    }

    const toApply = selectedValue ?? sleepTimerOptions[0]?.value;
    if (toApply) {
      handleSelection(toApply);
    }
  }, [isRunningTimer, selectedValue, handleSelection]);

  return {
    options: sleepTimerOptions,
    selectedValue,
    onSelectValue,
    isTimerActive: isRunningTimer,
    remainingText,
    primaryButtonLabel,
    onPrimaryAction,
  };
};
