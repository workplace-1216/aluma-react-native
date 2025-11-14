import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#113D56',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: heightToDP('10%'),
    paddingTop: heightToDP('1.5%'),
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
    paddingHorizontal: widthToDP(10),
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveUtils.relativeFontSize(26),
    color: colors.WHITE,
    fontWeight: '600',
    marginTop: responsiveUtils.relativeHeight(2),
  },
  logo: {
    height: widthToDP('30.23%'),
    width: widthToDP('30.23%'),
    marginBottom: heightToDP('1.788%'),
  },
  description: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: responsiveUtils.relativeHeight(2),
    fontSize: responsiveUtils.relativeFontSize(16),
    lineHeight: heightToDP('2.6%'),
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    paddingVertical: heightToDP('2.2%'),
    alignItems: 'center',
    marginTop: responsiveUtils.relativeHeight(4),
  },
  primaryText: {
    color: '#123C54',
    fontSize: responsiveUtils.relativeFontSize(18),
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: heightToDP('2.2%'),
    alignItems: 'center',
    marginTop: responsiveUtils.relativeHeight(2),
    borderWidth: 1,
    borderColor: colors.WHITE,
  },
  secondaryText: {
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(18),
    fontWeight: '600',
  },
});
