import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: heightToDP('3.43%'),
  },
  option: {
    borderWidth: 3,
    borderColor: colors.WHITE,
    paddingLeft: widthToDP('5%'),
    paddingRight: widthToDP('4%'),
    // marginVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // height: heightToDP('6.33%'),
    borderRadius: 33,
    width: '100%',
    paddingVertical: widthToDP('3.65%'),
  },
  selectedOption: {
    backgroundColor: colors.WHITE,
  },
  text: {
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    lineHeight: responsiveUtils.relativeFontSize(21),
    letterSpacing: responsiveUtils.relativeFontSize(21) * -0.03,
    fontFamily: Fonts.FigtreeMedium,
  },
  selectedText: {
    color: colors.BLACK,
  },
  circleStyle: {
    width: widthToDP('4.19%'),
    height: widthToDP('4.19%'),
    borderWidth: 1,
    borderColor: colors.WHITE,
    borderRadius: 50,
    backgroundColor: colors.LIGHT_CYAN_BLUE,
  },
});
