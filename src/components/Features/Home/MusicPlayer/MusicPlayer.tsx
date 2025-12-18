// components/Features/Home/MusicPlayer/MusicPlayer.tsx
import React, {useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import MusicWheel from '../../../UI/MusicWheel';
import {SvgTimer} from '../../../../assets/svg';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {styles} from './styles';
import {BreathworkExercise} from '../../../../utils/types';
import {FREQUENCY} from '../../../../redux/slice/moodSlice';
import GuestVideoPromptModal from '../../../UI/GuestVideoPromptModal/GuestVideoPromptModal';
import {audioController} from '../../../../services/audio/AudioController';

type Props = {
  exercise?: BreathworkExercise;
  setIsTimerModalVisible: (value: boolean) => void;
  currentFrequency: FREQUENCY;
  onSelectSound: (index: number) => void;
  playQuadrant: (url: string) => void;
  isGuestUser: boolean;
  onGuestCtaPress: () => void;
  onStartLastGuide: () => void;
  hasLastVoiceGuide: boolean;
};

const MusicPlayer: React.FC<Props> = ({
  exercise,
  setIsTimerModalVisible,
  currentFrequency,
  onSelectSound,
  playQuadrant,
  isGuestUser,
  onGuestCtaPress,
  onStartLastGuide,
  hasLastVoiceGuide,
}) => {
  const [promptVisible, setPromptVisible] = React.useState(false);

  const pauseWheel = promptVisible;

  // Pause audio when prompt modal opens
  useEffect(() => {
    if (promptVisible) {
      audioController.pauseAll();
    }
  }, [promptVisible]);

  const handlePrimaryAction = React.useCallback(() => {
    setPromptVisible(false);
    if (isGuestUser) {
      onGuestCtaPress();
      return;
    }
    onStartLastGuide();
  }, [isGuestUser, onGuestCtaPress, onStartLastGuide]);

  return (
    <View>
      <MusicWheel
        wheelOnLongPress={() => setPromptVisible(true)} // abre GuidedVoice prompt
        breathWorkData={exercise}
        isModalVisible={pauseWheel} // pausa animações
        currentFrequency={currentFrequency}
        onSelectSound={onSelectSound}
        playQuadrant={playQuadrant}
      />

      {promptVisible && (
        <GuestVideoPromptModal
          visible={promptVisible}
          onClose={() => setPromptVisible(false)}
          // isGuest={isGuestUser}
          isGuest={false}
          onSignUpPress={isGuestUser ? handlePrimaryAction : undefined}
          onStartPress={
            !isGuestUser && hasLastVoiceGuide ? handlePrimaryAction : undefined
          }
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
