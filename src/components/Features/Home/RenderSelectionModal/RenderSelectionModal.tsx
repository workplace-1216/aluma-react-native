import SelectionModal from '../../../Modals/SelectionModal';
import {RenderSelectionModalProps} from './types';

const RenderSelectionModal = ({
  isModalVisible,
  setIsModalVisible,
  breathExercise,
  setExercise,
  stopQuadrant,
  pause,
  timeLeft,
  isRunning,
}: RenderSelectionModalProps) => (
  <SelectionModal
    isModalVisible={isModalVisible}
    title="Breathwork Settings"
    setIsModalVisible={setIsModalVisible}
    breathworkSettings={breathExercise}
    handleSelection={setExercise}
    stopQuadrant={stopQuadrant}
    pause={pause}
    timeLeft={timeLeft}
    isRunning={isRunning}
  />
);

export default RenderSelectionModal;
