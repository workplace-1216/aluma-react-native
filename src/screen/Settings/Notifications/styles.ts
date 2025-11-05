// notifications.styles.js
import { StyleSheet } from 'react-native';
import { widthToDP } from 'react-native-responsive-screens';
import responsiveUtils from '../../../utils/responsiveUtils';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';

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
    marginBottom: widthToDP(7),
  },
  content: {
    flex: 1,
  },
  section: {
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
  },
  divider: {
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    marginVertical: widthToDP(7),
  },
  // toggleItem: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingHorizontal: widthToDP(8),
  //   marginLeft: widthToDP(6),
  // },
  toggleText: {
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
  navItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthToDP(8),
    marginLeft: widthToDP(6),
  },
  navText: {
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
});
