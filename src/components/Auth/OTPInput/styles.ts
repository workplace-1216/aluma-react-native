import {StyleSheet} from 'react-native';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: 67,
    height: 56,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: responsiveUtils.relativeFontSize(16),
  },
});
