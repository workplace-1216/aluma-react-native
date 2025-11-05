import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {SvgSetting, SvgInformation} from '../../../../assets/svg';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {styles} from './styles';
import {FREQUENCY} from '../../../../redux/slice/moodSlice';

type Props = {
  currentFrequency: FREQUENCY;
  onInfoPress: (frequency: FREQUENCY) => void;
  onVoiceSettingPress: () => void;
};

const BottomButtons: React.FC<Props> = ({
  currentFrequency,
  onInfoPress,
  onVoiceSettingPress,
}) => {
  const infoDisabled = !currentFrequency;

  return (
    <View style={styles.bottomButtonView}>
      <TouchableOpacity
        style={styles.Button}
        onPress={() => onInfoPress(currentFrequency)}>
        <SvgSetting height={heightToDP(1.8)} width={widthToDP('5.81%')} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.Button, {opacity: infoDisabled ? 0.5 : 1}]}
        disabled={infoDisabled}
        onPress={onVoiceSettingPress}>
        <SvgInformation
          height={heightToDP('2.575%')}
          width={widthToDP('5.581%')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomButtons;
