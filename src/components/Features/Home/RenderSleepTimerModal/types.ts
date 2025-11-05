export type RenderSleepTimerModalProps = {
  isTimerModalVisible: boolean;
  setIsTimerModalVisible: (val: boolean) => void;
  handleTimerSelection: (val: string) => void;
  sleepTimer: any;
}
