import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#113D56',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: heightToDP('11%'),
    paddingTop: heightToDP('2%'),
    overflow: 'hidden',
  },
  modalView: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  content: {
    paddingHorizontal: widthToDP(11),
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: responsiveUtils.relativeHeight(2),
  },
  description: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: responsiveUtils.relativeHeight(2),
    fontSize: responsiveUtils.relativeFontSize(14),
    lineHeight: heightToDP('2.4%'),
    fontWeight: '600',
  },
  link: {
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    paddingVertical: heightToDP('2.2%'),
    alignItems: 'center',
    marginTop: responsiveUtils.relativeHeight(3),
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#123C54',
    fontSize: responsiveUtils.relativeFontSize(18),
    fontWeight: '600',
  },
});
