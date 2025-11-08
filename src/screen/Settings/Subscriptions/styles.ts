import {StyleSheet} from 'react-native';
import {heightToDP} from 'react-native-responsive-screens';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingLeft: '6%',
    zIndex: 2,
  },
  headerTitle: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(23),
    color: colors.WHITE,
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
  },
  borderBottomLine: {
    width: '100%',
    borderBottomColor: colors.WHITE,
    opacity: 0.35,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    // width: '80%',
    paddingHorizontal: heightToDP('3%'),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: heightToDP('5%'),
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: heightToDP('5%'),
  },
  logo: {
    height: responsiveUtils.relativeHeight(16.84),
    width: responsiveUtils.relativeHeight(13.84),
  },
  textWrapper: {
    width: '70%',
  },
  titleText: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    textAlign: 'center',
    marginBottom: heightToDP('4.183%'),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: heightToDP('3%'),
    marginTop: heightToDP('4%'),
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    paddingVertical: heightToDP('2%'),
    paddingHorizontal: heightToDP('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginBottom: heightToDP('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: responsiveUtils.relativeFontSize(18),
    color: '#000',
    fontFamily: Fonts.FigtreeSemi,
    fontWeight: '600',
  },
  restoreButton: {
    width: '100%',
    paddingVertical: heightToDP('1.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightToDP('2%'),
  },
  restoreButtonText: {
    fontSize: responsiveUtils.relativeFontSize(14),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeRegular,
    textDecorationLine: 'underline',
  },
  legalTextContainer: {
    width: '100%',
    paddingHorizontal: heightToDP('2%'),
    marginTop: heightToDP('1%'),
    alignItems: 'center',
  },
  legalText: {
    fontSize: responsiveUtils.relativeFontSize(12),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeRegular,
    textAlign: 'center',
    lineHeight: responsiveUtils.relativeFontSize(16),
    opacity: 0.8,
  },
  legalLink: {
    fontSize: responsiveUtils.relativeFontSize(12),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeRegular,
    textDecorationLine: 'underline',
    opacity: 1,
  },
});
