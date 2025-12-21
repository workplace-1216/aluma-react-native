import {StyleSheet} from 'react-native';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
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
    width: '70%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: heightToDP('6%'),
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: heightToDP('5%'),
  },
  logo: {
    width: 129,
    height: 157,
  },

  titleText: {
    fontSize: responsiveUtils.relativeFontSize(35),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    textAlign: 'center',
    marginBottom: heightToDP('4%'),
  },
  subtitleText: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: heightToDP('4%'),
  },
  inviteButton: {
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    paddingVertical: heightToDP('2%'),
    paddingHorizontal: widthToDP('10%'),
    width: widthToDP('80%'),
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#123C54',
    fontFamily: Fonts.FigtreeMedium,
    fontSize: responsiveUtils.relativeFontSize(21),
  },
   webViewStyle:{
    flex:1,
  },
});
