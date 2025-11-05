import {StyleSheet} from 'react-native';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import Fonts from '../../../../assets/fonts';
import responsiveUtils from '../../../../utils/responsiveUtils';
import colors from '../../../../assets/colors';

export const styles = StyleSheet.create({
  backBtn: {
    width: widthToDP('85%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: widthToDP('2%'),
  },
  frequencyInfoWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: widthToDP(1.5),
  },
  frequencyInfoTitle: {
    fontFamily: Fonts.FigtreeBold,
    fontSize: responsiveUtils.relativeFontSize(21),
    width: widthToDP('56.05%'),
    textAlign: 'center',
    color: colors.WHITE,
  },
  moodImage: {
    height: heightToDP('14.48%'),
    width: heightToDP('14.48%'),
    borderRadius: heightToDP('14.48%') / 2,
    alignSelf: 'center',
    marginVertical: 20,
  },
  frequencyInfoDescription: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(23),
    lineHeight: responsiveUtils.relativeFontSize(23),
    textAlign: 'center',
    color: colors.WHITE,
    width: widthToDP('80.84%'),
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: heightToDP('4.04%'),
    gap: heightToDP('2.361%'),
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
    width: widthToDP('23.26%'),
    height: heightToDP('4.29%'),
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
  },
  scrollContainer: {
    height: heightToDP('22%'),
    width: widthToDP('90%'),
  },
  scrollContent: {
    alignItems: 'center',
  },
});
