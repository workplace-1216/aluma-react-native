import React, {useState, useEffect, useMemo, useRef} from 'react';
import {View, Text, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {styles} from './styles';
import {BreathworkExercise, VoiceGuide} from '../../../utils/types';
import voiceGuideSound from '../../../hooks/TutorSoundHook';
import {isSmallAppleScreen} from '../../../utils/isSmallAppleScreen';
import {useAppSelector} from '../../../redux/store';
import {toEffectiveVolume} from '../../../utils/volumeUtils';

interface BreathingCircleProps {
  breathWorkData: BreathworkExercise;
  durations?: number[]; // Expecting an array of 4 numbers (seconds)
  tutorVoiceGuide: VoiceGuide | undefined;
  onCycleComplete?: () => void;
}
const {width} = Dimensions.get('window');
const circleSize = width * (isSmallAppleScreen ? 0.9 : 0.74);
const minCircleSize = circleSize * 0.35;
const maxCircleSize = circleSize;
const INITIAL_COUNTDOWN = 3;

const BreathingCircle: React.FC<BreathingCircleProps> = ({
  durations = [4, 4, 4, 4],
  breathWorkData,
  tutorVoiceGuide,
  onCycleComplete,
}) => {
  const guidedVolumeRaw = useAppSelector(state => state.volume.volume ?? 1);
  const guidedVolume = useMemo(
    () => toEffectiveVolume(guidedVolumeRaw),
    [guidedVolumeRaw],
  );
  const onCycleCompleteRef = useRef(onCycleComplete);
  const scale = useSharedValue<number>(1);
  const animatedSize = useSharedValue<number>(minCircleSize);
  // NEW: refs to track timers for cleanup/reset
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(INITIAL_COUNTDOWN);
  const [started, setStarted] = useState<boolean>(false);
  const {play, pause, stop, clear, isPlaying, isLoaded, error} =
    voiceGuideSound(tutorVoiceGuide?.recording, guidedVolume);

  const BREATHING_CYCLE = useMemo(
    () =>
      [
        {label: 'INHALE', size: maxCircleSize, duration: durations[0] * 1000},
        {label: 'HOLD', size: maxCircleSize, duration: durations[1] * 1000},
        {label: 'EXHALE', size: minCircleSize, duration: durations[2] * 1000},
        {label: 'HOLD', size: minCircleSize, duration: durations[3] * 1000},
      ].filter(phase => phase.duration > 0),
    [durations],
  );

  const clearCountdownInterval = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const clearPhaseTimeout = () => {
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete;
  }, [onCycleComplete]);

  useEffect(() => {
    // NEW: reset everything when deps change (including exercise remount)
    clearCountdownInterval();
    clearPhaseTimeout();
    stop();

    setCountdown(INITIAL_COUNTDOWN);
    setStarted(false);
    setPhaseIndex(0);
    animatedSize.value = minCircleSize;

    const shouldStart = !tutorVoiceGuide?.recording || isLoaded;

    if (!shouldStart) {return;}

    // Start countdown
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearCountdownInterval();
          setStarted(true); // Start breathing cycle after countdown
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearCountdownInterval();
      clearPhaseTimeout();
      stop();
    };
  }, [durations, isLoaded, tutorVoiceGuide?.recording, breathWorkData?._id]);
  useEffect(() => {
    console.log('loading=>', isLoaded);
  }, [isLoaded]);

  // Play guide once when cycle starts; stop handled on reset/unmount
  useEffect(() => {
    if (started) {
      play();
    }
    // no cleanup here to avoid stopping mid-cycle; reset effect/unmount handles stop
  }, [started, play]);

  useEffect(() => {
    if (!started || BREATHING_CYCLE.length === 0) {return;}

    const cycleBreathing = () => {
      const {size, duration} = BREATHING_CYCLE[phaseIndex];

      animatedSize.value = withTiming(size, {duration});

      phaseTimeoutRef.current = setTimeout(() => {
        setPhaseIndex(prev => {
          const nextIndex = (prev + 1) % BREATHING_CYCLE.length;
          if (started && nextIndex === 0) {
            onCycleCompleteRef.current?.();
          }
          return nextIndex;
        });
      }, duration);

      return () => {
        clearPhaseTimeout();
      };
    };

    cycleBreathing();
    return () => {
      clearPhaseTimeout();
    };
  }, [
    phaseIndex,
    started,
    BREATHING_CYCLE,
    animatedSize,
  ]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearCountdownInterval();
      clearPhaseTimeout();
      stop();
      clear();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    width: animatedSize.value,
    height: animatedSize.value,
    borderRadius: animatedSize.value / 2,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Animated.View style={[styles.innerCircle, animatedStyle]} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {countdown > 0
            ? !isLoaded && tutorVoiceGuide?.recording
              ? 'Loading...'
              : countdown
            : BREATHING_CYCLE[phaseIndex]?.label || ' '}
        </Text>
      </View>
    </View>
  );
};

export default BreathingCircle;
