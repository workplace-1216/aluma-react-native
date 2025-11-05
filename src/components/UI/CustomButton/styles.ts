import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
import {widthToDP} from 'react-native-responsive-screens';

export default StyleSheet.create({
  button: {
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: widthToDP('3.65%'),
  },
  filled: {
    backgroundColor: colors.WHITE,
  },
  outline: {
    borderWidth: 3,
    borderColor: colors.WHITE,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: responsiveUtils.relativeFontSize(22),
    lineHeight: responsiveUtils.relativeFontSize(22),
    letterSpacing: responsiveUtils.relativeFontSize(22) * -0.03,
    fontFamily: Fonts.FigtreeMedium,
    color: colors.DARK_CYAN_BLUE,
  },
  outlineText: {
    color: colors.WHITE,
  },
});
