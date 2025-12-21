import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import CurvedText from '../CurvedText/CurvedText';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import BreathCircle from '../BreathCircle';
import {BreathworkExercise, QUADRANTS, VoiceGuide} from '../../../utils/types';

import {useAppSelector} from '../../../redux/store';
import {getVoiceGuideByTutorAndExerciseId} from '../../../utils/functions';
import {FREQUENCY} from '../../../redux/slice/moodSlice';
import {FlexibleGridLayout} from './Layout';

interface CircularSoundSelectorProps {
  onSelectSound: (index: number) => void;
  wheelOnLongPress: () => void;
  breathWorkData: BreathworkExercise | undefined;
  isModalVisible: boolean;
  currentFrequency: FREQUENCY | undefined;
  playQuadrant: (url: string) => void;
  muteAudio?: boolean;
  onBreathCycleComplete?: () => void;
}

const MusicWheel: React.FC<CircularSoundSelectorProps> = ({
  onSelectSound,
  currentFrequency,
  playQuadrant,
  wheelOnLongPress,
  breathWorkData,
  isModalVisible,
  muteAudio = false,
  onBreathCycleComplete,
}) => {
  const selectedTutor = useAppSelector(state => state.tutor.selectedTutor);
  const voiceGuide = useAppSelector(state => state.voiceGuide.allVoiceGuides);
  const [tutorVoiceGuide, setTutorVoiceGuide] = useState<VoiceGuide | undefined>();

  const scale = useSharedValue(0);
  const outerScale = useSharedValue(0);
  const opacity = useSharedValue(0.6);
  const centerPulseScale = useSharedValue(1);
  const centerPulseOpacity = useSharedValue(0);

  const quadrants: QUADRANTS[] =
    currentFrequency?.moodWheelItems?.[0]?.quadrants || [];

  useEffect(() => {
    if (muteAudio) {
      setTutorVoiceGuide(undefined);
      return;
    }

    if (breathWorkData && selectedTutor && voiceGuide) {
      const vg = getVoiceGuideByTutorAndExerciseId(
        voiceGuide,
        selectedTutor._id,
        breathWorkData._id,
      );
      setTutorVoiceGuide(vg);
    }
  }, [breathWorkData, selectedTutor, voiceGuide, muteAudio]);

  useEffect(() => {
    if (!isModalVisible) {
      startAnimationLoop();
    } else {
      stopAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible]);

  const startAnimationLoop = () => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, {duration: 0}),      // reset rápido
        withTiming(0, {duration: 5500}),     // fade out
      ),
      -1,
      false,
    );

    outerScale.value = withRepeat(
      withSequence(
        withTiming(1.2, {duration: 5500}),   // expande
        withTiming(0, {duration: 0}),        // volta pro centro (reset)
      ),
      -1,
      false,
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, {duration: 5500}),
        withTiming(0, {duration: 0}),
      ),
      -1,
      false,
    );
  };

  const stopAnimation = () => {
    scale.value = withTiming(0.33, {duration: 500});
    outerScale.value = withTiming(0.33, {duration: 500});
    opacity.value = withTiming(0, {duration: 500});
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const outerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: outerScale.value}],
    opacity: opacity.value,
  }));

  const centerPulseStyle = useAnimatedStyle(() => ({
    transform: [{scale: centerPulseScale.value}],
    opacity: centerPulseOpacity.value,
  }));

  const handleCenterLongPress = useCallback(() => {
    centerPulseScale.value = 1;
    centerPulseOpacity.value = 0.5;

    centerPulseScale.value = withSequence(
      withTiming(1.2, {duration: 160}),
      withTiming(1, {duration: 220}),
    );

    centerPulseOpacity.value = withSequence(
      withTiming(0.5, {duration: 0}),
      withTiming(0, {duration: 380}),
    );

    wheelOnLongPress();
  }, [centerPulseOpacity, centerPulseScale, wheelOnLongPress]);

  const renderItem = ({item, index}: {item: QUADRANTS; index: number}) => (
    <TouchableOpacity
      key={item?._id ?? index}
      onPress={() => {
        onSelectSound(index);
        if (!muteAudio && item?.audio_url) {
          playQuadrant(item.audio_url);
        }
      }}
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );

  return (
    <View style={styles.mainContainer}>
      {!breathWorkData?.steps ? (
        <>
          <View style={styles.container}>
            <View style={styles.overlay}>
              <View style={styles.outerCircle}>
                <CurvedText frequency={currentFrequency} />

                <View style={styles.highlightRing}>
                  <View style={styles.blueRing} />
                </View>

                <FlexibleGridLayout
                  soundOptions={quadrants}
                  renderItem={renderItem}
                  styles={styles}
                />

                <View style={styles.absolute}>
                  <TouchableOpacity
                    onLongPress={handleCenterLongPress}
                    style={styles.centerButton}
                    activeOpacity={0.9}>
                    <Animated.View
                      pointerEvents="none"
                      style={[styles.centerPulse, centerPulseStyle]}
                    />
                  </TouchableOpacity>
                </View>

                {!isModalVisible && (
                  <View style={styles.concentricCircles}>
                    {/* Anel externo + inner, como na versão antiga */}
                    <Animated.View style={[styles.circle, outerAnimatedStyle]} />
                    <Animated.View style={[styles.innerCircle, animatedStyle]} />
                  </View>
                )}
              </View>
            </View>
          </View>
          <View />
        </>
      ) : (
          <BreathCircle
            key={breathWorkData?._id} // NEW: force remount per exercise to reset animation/audio
            tutorVoiceGuide={tutorVoiceGuide}
            breathWorkData={breathWorkData}
            durations={breathWorkData?.steps}
            onCycleComplete={onBreathCycleComplete}
          />
      )}
    </View>
  );
};

export default MusicWheel;
