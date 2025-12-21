// components/Features/Home/MusicPlayer/MusicPlayer.tsx
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import MusicWheel from '../../../UI/MusicWheel';
import {SvgTimer} from '../../../../assets/svg';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {styles} from './styles';
import {BreathworkExercise} from '../../../../utils/types';
import {FREQUENCY} from '../../../../redux/slice/moodSlice';
import GuestVideoPromptModal from '../../../UI/GuestVideoPromptModal/GuestVideoPromptModal';

type Props = {
  exercise?: BreathworkExercise;
  setIsTimerModalVisible: (value: boolean) => void;
  currentFrequency: FREQUENCY;
  onSelectSound: (index: number) => void;
  playQuadrant: (url: string) => void;
  onStartLastGuide: () => void;
  hasLastVoiceGuide: boolean;
  muteVoiceGuide: boolean;
  onBreathCycleComplete?: () => void;
};

const MusicPlayer: React.FC<Props> = ({
  exercise,
  setIsTimerModalVisible,
  currentFrequency,
  onSelectSound,
  playQuadrant,
  onStartLastGuide,
  hasLastVoiceGuide,
  muteVoiceGuide,
  onBreathCycleComplete,
}) => {
  const [promptVisible, setPromptVisible] = React.useState(false);

  const pauseWheel = promptVisible;

  const handlePrimaryAction = React.useCallback(() => {
    setPromptVisible(false);
    onStartLastGuide();
  }, [onStartLastGuide]);

  return (
    <View>
      <MusicWheel
        wheelOnLongPress={() => setPromptVisible(true)}  // abre GuidedVoice prompt
        breathWorkData={exercise}
        isModalVisible={pauseWheel}                  // pausa animações
        currentFrequency={currentFrequency}
        onSelectSound={onSelectSound}
        playQuadrant={playQuadrant}
        muteAudio={muteVoiceGuide}
        onBreathCycleComplete={onBreathCycleComplete}
      />

      {promptVisible && (
        <GuestVideoPromptModal
          visible={promptVisible}
          onClose={() => setPromptVisible(false)}
          isGuest={false}
          onStartPress={handlePrimaryAction}
        />
      )}
      <View style={styles.footerRow}>
        {exercise ? (
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseTitle}>{exercise.title}</Text>
            {exercise.steps?.length ? (
              <Text style={styles.exerciseMeta}>
                {exercise.steps.filter(num => num > 0).join(' : ')}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.exerciseInfo} />
        )}
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
