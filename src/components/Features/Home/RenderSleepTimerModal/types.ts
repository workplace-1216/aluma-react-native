import {SleepTimes} from '../../../Modals/SleepTimerModal/types';

export type TimerModalControllerState = {
  options: SleepTimes[];
  selectedValue: string | null;
  onSelectValue: (value: string) => void;
  isTimerActive: boolean;
  remainingText?: string;
  primaryButtonLabel: string;
  onPrimaryAction: () => void;
};

export type RenderSleepTimerModalProps = {
  isTimerModalVisible: boolean;
  setIsTimerModalVisible: (val: boolean) => void;
  timerController: TimerModalControllerState;
  title: string;
};
