import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {Slider} from 'react-native-awesome-slider';
import {useSharedValue, withSpring} from 'react-native-reanimated';
import colors from '../../../assets/colors';
import styles from './styles';

// Redux (opcional: persistir último valor/analytics)
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../../redux/store';
import {setVolume as setVolumeAction} from '../../../redux/slice/volumeSlice';
import {usePlaybackStore} from '../../../state/usePlaybackStore';

type VolumeSliderProps = {
  setVolume?: (volume: number) => void;
};

const VolumeSlider: React.FC<VolumeSliderProps> = ({setVolume}) => {
  const dispatch = useDispatch();
  const persistedVolume = useAppSelector(s => s.volume.volume ?? 1);
  const isDraggingRef = useRef(false); // track active gesture to avoid fighting updates
  const min = useSharedValue(0);
  const max = useSharedValue(1);
  const progress = useSharedValue<number>(persistedVolume);

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  useEffect(() => {
    if (isDraggingRef.current) {return;} // don't fight user while dragging
    progress.value = withSpring(clamp01(persistedVolume));
  }, [persistedVolume, progress]);

  const handleSlidingStart = () => {
    isDraggingRef.current = true;
  };

  const handleSliderChange = (newProgress: number) => {
    // Only update UI-thread shared value while dragging; avoid heavy global updates here
    const v = clamp01(newProgress);
    progress.value = v;
  };

  const handleSlidingComplete = (finalValue?: number) => {
    const v = clamp01(finalValue ?? progress.value);
    isDraggingRef.current = false;
    progress.value = withSpring(v);
    // Apply global updates once per gesture end to avoid per-frame churn
    usePlaybackStore.getState().setVolume(v);
    dispatch(setVolumeAction(v));
    if (setVolume) {
      setVolume(v);
    }
  };

  return (
    <View>
      <Slider
        style={styles.sliderStyle}
        progress={progress}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleSliderChange}
        onSlidingComplete={handleSlidingComplete}
        minimumValue={min}
        maximumValue={max}
        thumbTouchSize={300}
        thumbWidth={30}
        sliderHeight={3.22}
        theme={{
          disableMinTrackTintColor: colors.WHITE,
          maximumTrackTintColor: 'rgba(255,255,255,0.5)',
          minimumTrackTintColor: colors.WHITE,
          cacheTrackTintColor: '#333',
          bubbleBackgroundColor: 'transparent',
          bubbleTextColor: 'transparent',
          heartbeatColor: '#999',
        }}
      />
    </View>
  );
};

export default VolumeSlider;
