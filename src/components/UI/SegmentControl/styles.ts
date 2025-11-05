import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 6,
    alignItems: 'center',
    width: '49%',
    backgroundColor: colors.SOFT_GRAY_OP10,
  },
  selectedTab: {
    backgroundColor: colors.SOFT_GRAY_OP50,
    width: '49%',
  },
  text: {
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(21),
  },
});
