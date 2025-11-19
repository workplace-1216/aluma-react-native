import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';
import {isSmallAppleScreen} from '../../../utils/isSmallAppleScreen';

const {width} = Dimensions.get('window');
const circleSize = width * (isSmallAppleScreen ? 0.9 : 0.95);

export const styles = StyleSheet.create({
  container: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  circle: {
    width: circleSize * 0.77,
    height: circleSize * 0.77,
    borderRadius: (circleSize * 0.77) / 2,
    borderWidth: 4,
    borderColor: colors.WHITE,
    position: 'absolute',
  },
  innerCircle: {
    width: circleSize * 0.5,
    height: circleSize * 0.5,
    borderRadius: circleSize * 0.25,
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
