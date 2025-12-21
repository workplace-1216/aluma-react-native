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
    marginTop: heightToDP('10%'),
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
    fontSize: responsiveUtils.relativeFontSize(19),
    lineHeight: responsiveUtils.relativeFontSize(19),
    textAlign: 'center',
    color: colors.WHITE,
    width: widthToDP('80.84%'),
  },
  actionButtonContainer: {
    width: widthToDP('50%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightToDP('4.29%'),
    gap: heightToDP('2.361%'),
  },
  secondaryActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    gap: heightToDP('2%'),
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
    flex: 1,
    height: heightToDP('4.29%'),
  },
  primaryActionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
    width: '100%',
    height: heightToDP('4.5%'),
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
    maxHeight: heightToDP('15%'),
    width: widthToDP('90%'),
  },
  scrollContent: {
    alignItems: 'center',
  },
});
