// components/Features/Home/RenderGuidedVoiceModal/RenderGuidedVoiceModal.tsx
import React from 'react';
import GuidedVoiceSelectionModal from '../../../Modals/GuidedVoiceSelectionModal/GuidedVoiceSelectionModal';
import {VoiceGuide} from '../../../../utils/types';

export type RenderGuidedVoiceModalProps = {
  isVoiceSettingVisible: boolean;
  setIsVoiceSettingVisible: (v: boolean) => void;
  onStartGuide?: (payload: {guide: VoiceGuide | null; muteAudio: boolean}) => void;
  onRequireSubscription?: () => void;
};

const RenderGuidedVoiceModal: React.FC<RenderGuidedVoiceModalProps> = ({
  isVoiceSettingVisible,
  setIsVoiceSettingVisible,
  onStartGuide,
  onRequireSubscription,
}) => (
  <GuidedVoiceSelectionModal
    isVoiceSettingVisible={isVoiceSettingVisible}
    title="Voice guides"
    setIsVoiceSettingVisible={setIsVoiceSettingVisible}
    onStartGuide={onStartGuide ?? (() => {})}
    onRequireSubscription={onRequireSubscription}
  />
);

export default RenderGuidedVoiceModal;
