import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {SvgMenuDot} from '../../../../assets/svg';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {styles} from './styles';

type Props = {
  exercise?: BreathworkExercise;
  frequencyInfo?: FREQUENCY;
  onSettingsPress: () => void;
};

const Header: React.FC<Props> = ({
  exercise,
  frequencyInfo,
  onSettingsPress,
}) => (
  <View
    style={[
      styles.headerView,
      !exercise ? {marginBottom: heightToDP('1%')} : null,
    ]}>
    {!frequencyInfo && (
      <TouchableOpacity style={styles.menuButton} onPress={onSettingsPress}>
        <SvgMenuDot height={heightToDP('0.536%')} width={widthToDP('4.884%')} />
      </TouchableOpacity>
    )}
    {exercise && (
      <View>
        <Text style={styles.breathExerciseDetail}>{exercise.title}</Text>
        <Text style={styles.breathExerciseDetail}>
          {exercise.steps.filter(num => num > 0).join(' : ')}
        </Text>
        <Text style={styles.breathExerciseDetail}>
          {exercise.title ? '380 HZ' : null}
        </Text>
      </View>
    )}
  </View>
);

export default Header;
