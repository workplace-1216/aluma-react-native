import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
import {heightToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  subContainer: {
    flex: 1,
  },

  footerView: {
    alignItems: 'center',
    marginTop: heightToDP('9.65%') - 50,
  },
  description: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    fontFamily: Fonts.FigtreeMedium,
  },
  HeaderText: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(26),
    fontFamily: Fonts.FigtreeMedium,
  },

  bottomButton: {
    marginTop: heightToDP('3.038%'),
    flexDirection: 'row',
    marginBottom: 40,
    gap: 5,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: responsiveUtils.relativeFontSize(20),
    letterSpacing: responsiveUtils.relativeFontSize(20) * -0.03,
    // lineHeight: responsiveUtils.relativeFontSize(20),
    fontFamily: Fonts.FigtreeMedium,
    color: colors.WHITE,
    marginRight: 4,
    textDecorationLine: 'underline',
  },
  toastContainer: {
    minHeight: 50,
  },
  errorMessage: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    fontFamily: Fonts.FigtreeMedium,
  },
});
