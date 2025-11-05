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
});
