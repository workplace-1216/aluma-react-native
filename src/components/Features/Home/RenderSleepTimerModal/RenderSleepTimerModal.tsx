import SleepTimerModal from '../../../Modals/SleepTimerModal';
import {RenderSleepTimerModalProps} from './types';

const RenderSleepTimerModal = ({
  isTimerModalVisible,
  setIsTimerModalVisible,
  handleTimerSelection,
  sleepTimer,
}: RenderSleepTimerModalProps) => (
  <SleepTimerModal
    isModalVisible={isTimerModalVisible}
    title="Sleep Timer"
    setIsModalVisible={setIsTimerModalVisible}
    handleSelection={handleTimerSelection}
    sleepTimes={sleepTimer}
  />
);

export default RenderSleepTimerModal;
