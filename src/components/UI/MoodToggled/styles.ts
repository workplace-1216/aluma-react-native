import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  container: {
    width: widthToDP('15.35%'),
    height: heightToDP('4.184%'),
    borderRadius: 20,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  on: {
    backgroundColor: colors.WHITE_50,
  },
  off: {
    backgroundColor: colors.WHITE_50,
  },
  circleWrapper: {
    position: 'absolute',
    left: 2,
    top: 1,
    backgroundColor: colors.WHITE,
    borderRadius: 50,
  },
  circle: {
    width: heightToDP('3.86%'),
    height: heightToDP('3.86%'),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
