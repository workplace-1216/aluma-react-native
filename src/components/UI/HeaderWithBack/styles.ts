import { StyleSheet } from 'react-native';
import { widthToDP } from 'react-native-responsive-screens';
import responsiveUtils from '../../../utils/responsiveUtils';
import Fonts from '../../../assets/fonts';
import colors from '../../../assets/colors';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomWidth: 1,
    paddingVertical: widthToDP(4),
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingLeft: '6%',
    zIndex: 2,
  },
  headerTitle: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(25),
    letterSpacing: responsiveUtils.relativeFontSize(0.25),
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
});
