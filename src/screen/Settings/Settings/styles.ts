import { StyleSheet } from 'react-native';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
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
  navSideSpace: {
    minWidth: widthToDP(17),
  },
  headerTitle: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(26),
    color: colors.WHITE,
    textAlign: 'center',
    flex: 1,
  },

  borderBottomLine: {
    width: '100%',
    borderBottomColor: colors.WHITE,
    opacity: 0.35,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: heightToDP('3.5%'),
    paddingHorizontal: widthToDP('15%'),
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },

  menuText: {
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: heightToDP('3%'),
    marginBottom: heightToDP('2.5%'),
  },
  versionText: {
    fontSize: responsiveUtils.relativeFontSize(15),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
});
