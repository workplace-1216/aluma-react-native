import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
import {widthToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: widthToDP('2.5%'),
  },

  bottomButton: {
    // marginTop: heightToDP('3.038%'),
    // flexDirection: 'row',
    // marginBottom: 40,
    // gap: 5,
    // alignItems: 'center',
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
});
