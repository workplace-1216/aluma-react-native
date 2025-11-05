import React, {useCallback, useEffect, useRef} from 'react';
import {View, EmitterSubscription} from 'react-native';
import {Slider} from 'react-native-awesome-slider';
import {useSharedValue, withSpring} from 'react-native-reanimated';
import colors from '../../../assets/colors';
import styles from './styles';

// Sistema (API correta é import nomeado)
import { VolumeManager } from 'react-native-volume-manager';

// Redux (opcional: persistir último valor/analytics)
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../../redux/store';
import {setVolume as setVolumeAction} from '../../../redux/slice/volumeSlice';
import {usePlaybackStore} from '../../../state/usePlaybackStore';

type VolumeSliderProps = {
  setVolume?: (volume: number) => void;
};

const THROTTLE_MS = 200;
const MIN_DELTA = 0.02;

const VolumeSlider: React.FC<VolumeSliderProps> = ({setVolume}) => {
  const dispatch = useDispatch();
  const persistedVolume = useAppSelector(s => s.volume.volume); // 0..1 (opcional)
  const progress = useSharedValue<number>(persistedVolume ?? 1);
  const lastEmitRef = useRef<number>(0);
  const lastValueRef = useRef<number>(persistedVolume ?? 1);

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  const emitVolumeChange = useCallback(
    async (value: number) => {
      const now = Date.now();
      if (now - lastEmitRef.current < THROTTLE_MS) {
        return;
      }
      if (Math.abs(value - lastValueRef.current) < MIN_DELTA) {
        return;
      }

      lastEmitRef.current = now;
      lastValueRef.current = value;

      try {
        await VolumeManager.setVolume(value, {showUI: false});
      } catch (e) {
        // swallow errors; fall back to stored volume only
      }

      dispatch(setVolumeAction(value));
      usePlaybackStore.getState().setVolume(value);
      if (setVolume) {
        setVolume(value);
      }
    },
    [dispatch, setVolume],
  );

  useEffect(() => {
    let sub: EmitterSubscription | undefined;

    const init = async () => {
      try {
        const status = await VolumeManager.getVolume();
        const sysVol = clamp01(status?.volume ?? 1);

        progress.value = withSpring(sysVol);
        dispatch(setVolumeAction(sysVol));
        usePlaybackStore.getState().setVolume(sysVol);
        if (setVolume) {
          setVolume(sysVol);
        }
        lastValueRef.current = sysVol;

        // Ocultar HUD nativo se quiser (pode trocar para true se preferir ver)
        await VolumeManager.showNativeVolumeUI({ enabled: false });

        // Assina mudanças do hardware (botões físicos)
        sub = VolumeManager.addVolumeListener(result => {
          const v = clamp01(result?.volume ?? 0);
          progress.value = withSpring(v);
          dispatch(setVolumeAction(v));
          usePlaybackStore.getState().setVolume(v);
          if (setVolume && Math.abs(v - lastValueRef.current) >= MIN_DELTA) {
            setVolume(v);
          }
          lastValueRef.current = v;
        });
      } catch (e) {
        // ignore init errors; slider will stay at default volume
      }
    };

    init();

    return () => {
      try {
        if (sub) {
          sub.remove();
        }
      } catch (e) {
        // ignore cleanup failures
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSliderChange = (newProgress: number) => {
    const v = clamp01(newProgress);
    progress.value = v;
    usePlaybackStore.getState().setVolume(v);
    emitVolumeChange(v);
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
