import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
import {heightToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingLeft: '6%',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerView: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '78%',
    marginTop: '10%',
  },
  footerView: {
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    // marginTop: hp('15%') + 50,
    marginTop: heightToDP('19%') - 80,
    justifyContent: 'flex-end',
    gap: heightToDP('3.86%'),
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
    marginRight: 4,
    fontFamily: Fonts.FigtreeMedium,
    color: colors.WHITE,
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
