import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../../assets/colors';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import responsiveUtils from '../../../utils/responsiveUtils';
import { isSmallAppleScreen } from '../../../utils/isSmallAppleScreen';

const { width } = Dimensions.get('window');

const circleSize = width * (isSmallAppleScreen ? 0.9 : 0.95);

export const styles = StyleSheet.create({
  mainContainer: {},
  container: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: circleSize / 2,
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    width: 120,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    left: '50%',
    marginLeft: -60,
    top: '50%',
    backgroundColor: 'pink',
  },
  soundLabel: {
    color: '#ffffff',
    fontSize: responsiveUtils.relativeFontSize(16),
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  selectedLabel: {
    color: '#4a9fff',
    fontWeight: '700',
  },
  highlightRing: {
    position: 'absolute',
    width: circleSize * 0.77,
    height: circleSize * 0.77,
    borderRadius: circleSize * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  blueRing: {
    width: '100%',
    height: '100%',
    borderRadius: (circleSize * 0.75) / 2,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  concentricCircles: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    zIndex: -1,
  },
  circle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'white',
  },
  innerCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  timerButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  segmentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveUtils.relativeFontSize(14),
    textAlign: 'center',
  },
  selectedSegmentText: {
    color: '#00aaff',
    fontWeight: '900',
  },
  arrowButton: {
    alignSelf: 'flex-end',
    marginTop: -heightPercentageToDP('7%'),
    marginRight: 5,
  },
  ellipseSmall: {
    position: 'absolute',
    width: 10,
    height: 15,
    backgroundColor: colors.WHITE_80,
    borderRadius: 100,
    transform: [{ scaleY: 3 }],
    right: 0,
  },
  ellipseMedium: {
    position: 'absolute',
    width: 16,
    height: 15,
    backgroundColor: colors.WHITE_80,
    borderRadius: 100,
    transform: [{ scaleY: 3 }],
    right: 0,
  },
  ellipseLarge: {
    position: 'absolute',
    width: 23,
    height: 15,
    backgroundColor: colors.WHITE_80,
    borderRadius: 100,
    transform: [{ scaleY: 3 }],
  },
  buttonPressLength1: {
    width: circleSize,
    height: circleSize,
  },
  buttonPressLength2: {
    width: circleSize / 2,
    height: circleSize,
  },
  buttonPressLength3: {
    width: circleSize / 2,
    height: circleSize,
  },
  buttonPressLength4: {
    width: circleSize / 2,
    height: circleSize / 2,
  },
  centerButton: {
    height: circleSize * 0.15,
    width: circleSize * 0.15,
    borderRadius: circleSize * 0.2,
  },
  absolute: {
    position: 'absolute',
  },
});
