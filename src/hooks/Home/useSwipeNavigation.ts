import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, withSpring } from 'react-native-reanimated';
import { FREQUENCY } from '../../redux/slice/moodSlice';

const useSwipeNavigation = (
  frequencyInfo: FREQUENCY | undefined,
  onSwipeUp: () => void,
  onSwipeLeft: () => void
) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (!frequencyInfo) {
        translateY.value = event.translationY;
        translateX.value = event.translationX;
      }
    })
    .onEnd(event => {
      if (frequencyInfo) {
        translateY.value = withSpring(0);
        translateX.value = withSpring(0);
        return;
      }

      const SWIPE_UP = event.velocityY < -200;
      const SWIPE_LEFT = event.velocityX < -200;

      if (SWIPE_UP) {
        runOnJS(onSwipeUp)();
      }
      else if (SWIPE_LEFT) {
        runOnJS(onSwipeLeft)();
      }
      else {
        translateY.value = withSpring(0);
        translateX.value = withSpring(0);
      }
    });

  return panGesture;
};

export default useSwipeNavigation;
