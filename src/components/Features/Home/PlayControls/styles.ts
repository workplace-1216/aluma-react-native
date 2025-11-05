import { StyleSheet } from 'react-native';
import colors from '../../../../assets/colors';
import { widthToDP } from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  playButtonView: {
    paddingHorizontal: widthToDP(8),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  sideArea: {
    width: widthToDP(24),
    alignItems: 'flex-end',
  },
  buttonPlay: {
    height: widthToDP(23),
    width: widthToDP(23),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
  },
});
