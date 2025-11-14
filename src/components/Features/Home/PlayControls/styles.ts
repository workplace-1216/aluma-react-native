import { StyleSheet } from 'react-native';
import colors from '../../../../assets/colors';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  playButtonView: {
    paddingHorizontal: widthToDP(8),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPlay: {
    height: widthToDP(23),
    width: widthToDP(23),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
  },
  iconPlaceholder: {
    height: heightToDP('3.004%'),
    width: widthToDP('6.744%'),
  },
});
