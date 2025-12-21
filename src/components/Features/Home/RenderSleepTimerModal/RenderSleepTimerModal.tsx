import SleepTimerModal from '../../../Modals/SleepTimerModal';
import {RenderSleepTimerModalProps} from './types';

const RenderSleepTimerModal = ({
  isTimerModalVisible,
  setIsTimerModalVisible,
  timerController,
  title,
}: RenderSleepTimerModalProps) => (
  <SleepTimerModal
    isModalVisible={isTimerModalVisible}
    title={title}
    setIsModalVisible={setIsTimerModalVisible}
    options={timerController.options}
    selectedValue={timerController.selectedValue}
    onSelectValue={timerController.onSelectValue}
    isTimerActive={timerController.isTimerActive}
    remainingText={timerController.remainingText}
    primaryButtonLabel={timerController.primaryButtonLabel}
    onPrimaryAction={timerController.onPrimaryAction}
  />
);

export default RenderSleepTimerModal;
