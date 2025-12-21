import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: heightToDP('18.56%'),
    height: heightToDP('22.31%'),
  },
  headphoneContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: heightToDP('2.146%'),
  },
  bottomText: {
    marginTop: heightToDP('1.072%'),
    fontSize: responsiveUtils.relativeFontSize(17),
    fontFamily: Fonts.FigtreeMedium,
    color: colors.WHITE,
    textAlign: 'center',
  },
});
