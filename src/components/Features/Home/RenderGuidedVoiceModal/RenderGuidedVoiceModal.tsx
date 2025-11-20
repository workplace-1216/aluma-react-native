// components/Features/Home/RenderGuidedVoiceModal/RenderGuidedVoiceModal.tsx
import React from 'react';
import GuidedVoiceSelectionModal from '../../../Modals/GuidedVoiceSelectionModal/GuidedVoiceSelectionModal';
import {TutorResponse, VoiceGuide} from '../../../../utils/types';

export type RenderGuidedVoiceModalProps = {
  isVoiceSettingVisible: boolean;
  setIsVoiceSettingVisible: (v: boolean) => void;
  tutors: TutorResponse[];
  exerciseId?: string;
  onStartGuide?: (payload: {guide: VoiceGuide | null; muteAudio: boolean}) => void;
  onRequireSubscription?: () => void;
};

const RenderGuidedVoiceModal: React.FC<RenderGuidedVoiceModalProps> = ({
  isVoiceSettingVisible,
  setIsVoiceSettingVisible,
  tutors,
  exerciseId,
  onStartGuide,
  onRequireSubscription,
}) => (
  <GuidedVoiceSelectionModal
    isVoiceSettingVisible={isVoiceSettingVisible}
    title="Voice guides"
    setIsVoiceSettingVisible={setIsVoiceSettingVisible}
    tutors={tutors}
    currentExerciseId={exerciseId}
    onStartGuide={onStartGuide ?? (() => {})}
    onRequireSubscription={onRequireSubscription}
  />
);

export default RenderGuidedVoiceModal;
