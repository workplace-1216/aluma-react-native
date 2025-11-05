import { StyleSheet } from 'react-native';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
import responsiveUtils from '../../../utils/responsiveUtils';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';

export const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: heightToDP(2.3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthToDP(8),
    marginLeft: widthToDP(6),
  },
  itemWithElement: {
    paddingVertical: 0,
  },
  menuText: {
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
  divider: {
    height: 1.5,
    marginVertical: heightToDP(1.25),
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});
