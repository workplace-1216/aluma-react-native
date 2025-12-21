import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {SvgMenuDot} from '../../../../assets/svg';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {styles} from './styles';
import {BreathworkExercise, FREQUENCY} from '../../../../utils/types';

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
  </View>
);

export default Header;
