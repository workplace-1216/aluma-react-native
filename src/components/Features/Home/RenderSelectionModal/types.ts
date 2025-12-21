export type RenderSelectionModalProps = {
  isModalVisible: Boolean;
  setIsModalVisible:
    | ((value: Boolean) => void)
    | ((value: Boolean) => null)
    | ((value: Boolean) => {});
  breathExercise: any;
  setExercise: (val: any) => void;
  stopQuadrant: () => void;
  pause: () => void;
  timeLeft: number;
  isRunning: boolean;
};
