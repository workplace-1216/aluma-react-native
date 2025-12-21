import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorIcon: {
    height: 16,
    width: 16,
    tintColor: colors.errorIcon,
  },
  errorText: {
    fontSize: responsiveUtils.relativeFontSize(12),
    color: colors.errorText,
    marginLeft: 5,
  },
});
