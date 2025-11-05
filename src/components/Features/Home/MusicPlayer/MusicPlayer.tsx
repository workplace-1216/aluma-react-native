// components/Features/Home/MusicPlayer/MusicPlayer.tsx
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import MusicWheel from '../../../UI/MusicWheel';
import {SvgTimer} from '../../../../assets/svg';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {styles} from './styles';
import {BreathworkExercise, TutorResponse, VoiceGuide} from '../../../../utils/types';
import {FREQUENCY} from '../../../../redux/slice/moodSlice';

// ✅ GuidedVoice direto aqui
import GuidedVoiceSelectionModal from '../../../Modals/GuidedVoiceSelectionModal/GuidedVoiceSelectionModal';

type Props = {
  exercise?: BreathworkExercise;
  isModalVisible: boolean;                 // não usamos pra abrir nada aqui
  setIsModalVisible: (value: boolean) => void;
  setIsTimerModalVisible: (value: boolean) => void;
  currentFrequency: FREQUENCY;
  onSelectSound: (index: number) => void;
  playQuadrant: (url: string) => void;

  // ✅ novos: dados do GuidedVoice
  tutors: TutorResponse[];
  exerciseId?: string;
  onStartGuide: (guide: VoiceGuide | null) => void;
};

const MusicPlayer: React.FC<Props> = ({
  exercise,
  setIsTimerModalVisible,
  currentFrequency,
  onSelectSound,
  playQuadrant,
  tutors,
  exerciseId,
  onStartGuide,
}) => {
  // ✅ estado local: abrir/fechar SOMENTE o GuidedVoice
  const [voiceOpen, setVoiceOpen] = React.useState(false);

  // ✅ pausar animações do wheel apenas enquanto GuidedVoice aberto
  const pauseWheel = voiceOpen;

  return (
    <View>
      <MusicWheel
        wheelOnLongPress={() => setVoiceOpen(true)}  // abre GuidedVoice
        breathWorkData={exercise}
        isModalVisible={pauseWheel}                  // pausa animações
        currentFrequency={currentFrequency}
        onSelectSound={onSelectSound}
        playQuadrant={playQuadrant}
      />

      {/* ✅ GuidedVoice diretamente aqui */}
      {voiceOpen && (
  <GuidedVoiceSelectionModal
    title="Voice guides"
    isVoiceSettingVisible={true} // sempre true porque só renderiza aberto
    setIsVoiceSettingVisible={(v) => {
      if (!v) {setVoiceOpen(false);}
    }}
    tutors={tutors}
    currentExerciseId={exerciseId}
    onStartGuide={(guide) => {
      onStartGuide(guide);   // Home fará setExercise(...)
      setVoiceOpen(false);   // desmonta o sheet -> nada fica interceptando toques
    }}
  />
)}

      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.timerButton}
          onPress={() => setIsTimerModalVisible(true)}>
          <SvgTimer height={heightToDP('2.896%')} width={widthToDP('4.884%')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MusicPlayer;
