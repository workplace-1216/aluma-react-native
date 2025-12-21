import { StyleSheet } from 'react-native';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
import colors from '../../../../assets/colors';
import Fonts from '../../../../assets/fonts';

export const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    paddingHorizontal: widthToDP(2),
    alignSelf: 'center',
    marginTop: heightToDP('1%'),
  },
  menuButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: widthToDP(5),
    paddingVertical: widthToDP(3),
    marginBottom: heightToDP('1.3%'),
  },
  breathExerciseDetail: {
    fontSize: heightToDP('1.7%'),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
});
