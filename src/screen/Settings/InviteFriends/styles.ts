import { StyleSheet } from 'react-native';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: widthToDP(75),
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: heightToDP(1),
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightToDP(4),
  },
  logo: {
    height: widthToDP(40),
    objectFit: 'contain',
  },
  titleText: {
    fontSize: responsiveUtils.relativeFontSize(35),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    textAlign: 'center',
    marginBottom: heightToDP('4%'),
  },
  subtitleText: {
    fontSize: responsiveUtils.relativeFontSize(20),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    textAlign: 'center',
    marginBottom: heightToDP('4%'),
  },
  inviteButton: {
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    paddingVertical: heightToDP('2%'),
    paddingHorizontal: widthToDP('10%'),
    width: '100%',
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#123C54',
    fontFamily: Fonts.FigtreeMedium,
    fontSize: responsiveUtils.relativeFontSize(21),
  },
});
