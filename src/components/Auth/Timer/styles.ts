import {StyleSheet} from 'react-native';
import Colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  TimerTextStyle: {
    fontSize: responsiveUtils.relativeFontSize(14),
    color: Colors.BLACK,
    alignSelf: 'center',
    marginTop: 10,
  },
});
