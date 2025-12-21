import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {SvgBack, SvgPause, SvgPlay} from '../../../../assets/svg';
import MoonToggle from '../../../UI/MoodToggled/MoodToggled';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {styles} from './styles';
import {BreathworkExercise} from '../../../../utils/types';

type Props = {
  exercise?: BreathworkExercise;
  isPlaying: boolean;
  onExerciseBack: () => void;
  onPlay: () => void;
  onPause: () => void;
  night: boolean;
  onToggleNight: () => void;
};

const PlayControls: React.FC<Props> = ({
  exercise,
  isPlaying,
  onExerciseBack,
  onPlay,
  onPause,
  night,
  onToggleNight,
}) => (
  <View style={styles.playButtonView}>
    <View style={styles.sideArea}>
      {exercise ? (
        <TouchableOpacity onPress={onExerciseBack}>
          <SvgBack height={heightToDP('3.004%')} width={widthToDP('6.744%')} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
    <View style={styles.centerArea}>
      {isPlaying ? (
        <TouchableOpacity onPress={onPause} style={styles.buttonPlay}>
          <SvgPause />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPlay} style={styles.buttonPlay}>
          <SvgPlay />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.sideArea}>
      <MoonToggle initialState={night} onToggle={onToggleNight} />
    </View>
  </View>
);

export default PlayControls;
