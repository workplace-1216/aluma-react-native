import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {styles} from './styles';
import {BreathworkExercise, VoiceGuide} from '../../../utils/types';
import voiceGuideSound from '../../../hooks/TutorSoundHook';

interface BreathingCircleProps {
  breathWorkData: BreathworkExercise;
  durations?: number[]; // Expecting an array of 4 numbers (seconds)
  tutorVoiceGuide: VoiceGuide | undefined;
}
const {width} = Dimensions.get('window');
const circleSize = width * 0.85;
const minCircleSize = 110; // Small size (exhale)
const maxCircleSize = circleSize * 0.7;

const BreathingCircle: React.FC<BreathingCircleProps> = ({
  durations = [4, 4, 4, 4],
  breathWorkData,
  tutorVoiceGuide,
}) => {
  const scale = useSharedValue<number>(1);
  const animatedSize = useSharedValue<number>(minCircleSize);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(3);
  const [started, setStarted] = useState<boolean>(false);
  const {play, pause, stop, clear, isPlaying, isLoaded, error} =
    voiceGuideSound(tutorVoiceGuide?.recording);

  const BREATHING_CYCLE = [
    {label: 'INHALE', size: maxCircleSize, duration: durations[0] * 1000},
    {label: 'HOLD', size: maxCircleSize, duration: durations[1] * 1000},
    {label: 'EXHALE', size: minCircleSize, duration: durations[2] * 1000},
    {label: 'HOLD', size: minCircleSize, duration: durations[3] * 1000},
  ].filter(phase => phase.duration > 0);

  useEffect(() => {
    setCountdown(3); // Reset countdown on duration change
    setStarted(false); // Reset breathing cycle
    setPhaseIndex(0);
    const shouldStart = !tutorVoiceGuide?.recording || isLoaded;

    if (!shouldStart) {return;}

    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setStarted(true); // Start breathing cycle after countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [durations, isLoaded, tutorVoiceGuide?.recording]);
  useEffect(() => {
    console.log('loading=>', isLoaded);
  }, [isLoaded]);
  useEffect(() => {
    if (!started || BREATHING_CYCLE.length === 0) {return;}

    const cycleBreathing = () => {
      play();
      const {size, duration} = BREATHING_CYCLE[phaseIndex];

      animatedSize.value = withTiming(size, {duration});

      const timer = setTimeout(() => {
        setPhaseIndex(prev => (prev + 1) % BREATHING_CYCLE.length);
      }, duration);

      return () => {
        clearTimeout(timer);
        stop();
      };
    };

    cycleBreathing();
  }, [phaseIndex, started]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: animatedSize.value,
    height: animatedSize.value,
    borderRadius: animatedSize.value / 2,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle]} />
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
