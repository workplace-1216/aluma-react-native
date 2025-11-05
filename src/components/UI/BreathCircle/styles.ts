import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';
const {width} = Dimensions.get('window');
const circleSize = width * 0.85;
export const styles = StyleSheet.create({
  container: {
    width: circleSize * 0.77,
    height: circleSize * 0.77,
    borderRadius: circleSize * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.WHITE,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 75,
    backgroundColor: colors.WHITE_80,
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: responsiveUtils.relativeFontSize(20),
    fontWeight: 'bold',
  },
});
