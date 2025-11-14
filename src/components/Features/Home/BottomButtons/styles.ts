import { StyleSheet } from 'react-native';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
import colors from '../../../../assets/colors';

export const styles = StyleSheet.create({
  bottomButtonView: {
    marginTop: heightToDP('2%'),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  Button: {
    height: widthToDP(9.3),
    width: widthToDP(9.3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
    marginHorizontal: widthToDP('2%'),
  },
});
