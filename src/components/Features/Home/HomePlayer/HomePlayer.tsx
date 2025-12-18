import React from 'react';
import {View, StyleSheet} from 'react-native';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import VolumeSlider from '../../../UI/VolumeSlider/VolumeSlider';
import PlayControls from '../PlayControls/PlayControls';
import {widthToDP} from 'react-native-responsive-screens';
import {isSmallAppleScreen} from '../../../../utils/isSmallAppleScreen';
import {BreathworkExercise, VoiceGuide} from '../../../../utils/types';
import {FREQUENCY} from '../../../../redux/slice/moodSlice';

type HomePlayerProps = {
  exercise?: BreathworkExercise;
  night: boolean;
  setNight: () => void;
  setMoodWheelItemIndex: (index: number) => void;
  onBackFromExercise: () => void;
  setIsTimerModalVisible: (value: boolean) => void;
  isGuestUser: boolean;
  onGuestCtaPress: () => void;
  onStartLastGuide: () => void;
  lastVoiceGuide: VoiceGuide | null;
  currentFrequency: FREQUENCY;
  isPlaying: boolean;
  onPlayMusic: () => void;
  onPauseMusic: () => void;
  playQuadrant: (url: string) => void;
  setVolume: (volume: number) => void;
};

const HomePlayer: React.FC<HomePlayerProps> = ({
  exercise,
  night,
  setNight,
  setMoodWheelItemIndex,
  onBackFromExercise,
  setIsTimerModalVisible,
  isGuestUser,
  onGuestCtaPress,
  onStartLastGuide,
  lastVoiceGuide,
  currentFrequency,
  isPlaying,
  onPlayMusic,
  onPauseMusic,
  playQuadrant,
  setVolume,
}) => {
  return (
    <>
      <MusicPlayer
        exercise={exercise}
        setIsTimerModalVisible={setIsTimerModalVisible}
        currentFrequency={currentFrequency}
        onSelectSound={setMoodWheelItemIndex}
        playQuadrant={playQuadrant}
        isGuestUser={isGuestUser}
        onGuestCtaPress={onGuestCtaPress}
        onStartLastGuide={onStartLastGuide}
        hasLastVoiceGuide={Boolean(lastVoiceGuide)}
      />
      {isSmallAppleScreen ? <View style={{height: widthToDP(2)}} /> : null}
      <View style={exercise ? styles.volumeSliderExerciseSpacing : undefined}>
        <VolumeSlider setVolume={setVolume} />
      </View>
      {isSmallAppleScreen ? <View style={{height: widthToDP(2)}} /> : null}
      <PlayControls
        exercise={exercise}
        isPlaying={isPlaying}
        onExerciseBack={onBackFromExercise}
        onPlay={onPlayMusic}
        onPause={onPauseMusic}
        night={night}
        onToggleNight={setNight}
      />
    </>
  );
};

const styles = StyleSheet.create({
  volumeSliderExerciseSpacing: {
    marginTop: 0,
  },
});

export default React.memo(HomePlayer);
