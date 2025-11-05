import { StyleSheet } from 'react-native';
import responsiveUtils from '../../../../utils/responsiveUtils';
import colors from '../../../../assets/colors';
import Fonts from '../../../../assets/fonts';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  HeaderText: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(31),
    lineHeight: responsiveUtils.relativeFontSize(31),
    letterSpacing: responsiveUtils.relativeFontSize(31) * -0.03,
    fontFamily: Fonts.FigtreeMedium,
    marginBottom: widthToDP('1.86%'),
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingLeft: '6%',
  },
  circleLogo: {
    height: widthToDP('30.23%'),
    width: widthToDP('30.23%'),
    marginBottom: heightToDP('1.788%'),
  },
  description: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(22),
    letterSpacing: responsiveUtils.relativeFontSize(22) * -0.03,
    lineHeight: responsiveUtils.relativeFontSize(22),
    fontFamily: Fonts.FigtreeMedium,
    paddingHorizontal: widthToDP('5%'),
  },
  headerView: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: widthToDP('12.09%'),
    paddingTop: widthToDP('4.5%'),
    paddingBottom: widthToDP(1),
    alignItems: 'center',
  },
  footerView: {
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    gap: widthToDP('7.3%'),
    paddingTop: widthToDP('10%'),
    marginTop: widthToDP('17.3%'),
  },
  messageContainer: {
    position: 'absolute',
    width: '100%',
    top: widthToDP(-15),
    justifyContent: 'flex-end',
    height: widthToDP(20),
  },
  errorMessage: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    fontFamily: Fonts.FigtreeMedium,
  },
  successMessage: {
    textAlign: 'center',
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    fontFamily: Fonts.FigtreeMedium,
  },
  bottomButton: {
    marginTop: heightToDP('3.038%'),
    flexDirection: 'row',

    gap: 5,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: responsiveUtils.relativeFontSize(21),
    letterSpacing: responsiveUtils.relativeFontSize(20) * -0.03,
    marginRight: 4,
    fontFamily: Fonts.FigtreeMedium,
    color: colors.WHITE,
    textDecorationLine: 'underline',
  },
});
