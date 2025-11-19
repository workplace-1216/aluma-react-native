import React, {useEffect} from 'react';
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
  const progress = useSharedValue<number>(persistedVolume);

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  useEffect(() => {
    progress.value = withSpring(clamp01(persistedVolume));
  }, [persistedVolume, progress]);

  const handleSliderChange = (newProgress: number) => {
    const v = clamp01(newProgress);
    progress.value = v;
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
        onValueChange={handleSliderChange}
        minimumValue={useSharedValue(0)}
        maximumValue={useSharedValue(1)}
        thumbTouchSize={300}
        thumbWidth={30}
        sliderHeight={4}
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
