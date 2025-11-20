import React, {useEffect, useRef} from 'react';
import {View, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {navigate} from '../../../navigation/AppNavigator';
import {useFocusEffect} from '@react-navigation/native';
import {useSharedValue} from 'react-native-reanimated';
import {GestureDetector} from 'react-native-gesture-handler';
import routes from '../../../constants/routes';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import Header from '../../../components/Features/Home/Header';
import FrequencyInfo from '../../../components/Features/Home/FrequencyInfo/FrequencyInfo.tsx';
import MusicPlayer from '../../../components/Features/Home/MusicPlayer/MusicPlayer.tsx';
import BottomButtons from '../../../components/Features/Home/BottomButtons/BottomButtons.tsx';
import PlayControls from '../../../components/Features/Home/PlayControls/PlayControls.tsx';
import ChevronButton from '../../../components/Features/Home/ChevronButton/ChevronButton.tsx';
import useSwipeNavigation from '../../../hooks/Home/useSwipeNavigation.ts';
import useHomeState from '../../../hooks/Home/useHomeState.ts';
import RenderSelectionModal from '../../../components/Features/Home/RenderSelectionModal/RenderSelectionModal.tsx';
import RenderGuidedVoiceModal from '../../../components/Features/Home/RenderGuidedVoiceModal/RenderGuidedVoiceModal.tsx';
import RenderSubscriptionBottomSheet from '../../../components/Features/Home/RenderSubscriptionBottomSheet/RenderSubscriptionBottomSheet.tsx';
import RenderSleepTimerModal from '../../../components/Features/Home/RenderSleepTimerModal/RenderSleepTimerModal.tsx';
import {sleepTimerOptions} from '../../../constants/sleepTimer.ts';
import useHomeHandlers from '../../../hooks/Home/useHomeHandlers.ts';
import {widthToDP} from 'react-native-responsive-screens';
import {isSmallAppleScreen} from '../../../utils/isSmallAppleScreen.ts';
import BackgroundWrapper from '../../../components/UI/BackgroundWrapper/BackgroundWrapper.tsx';
import {useQuadrantAudioPlayer} from '../../../hooks/FrequencyPlayerHook/useQuadrantPlayer.ts';
import {useBaseAudioPlayer} from '../../../hooks/FrequencyPlayerHook/useBaseAudioPlayer.ts';
import BottomHomeModal from '../BottomHome/BottomHomeModal.tsx';
import VolumeSlider from '../../../components/UI/VolumeSlider/VolumeSlider.tsx';
import {VoiceGuide, BreathworkExercise} from '../../../utils/types';
import {selectCurrentFrequency} from '../../../redux/selectors/frequency';
import {audioController} from '../../../services/audio/AudioController';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

const {
    night,
    breathExercise,
    tutors,
    exercise,
    setExercise,
    frequencyInfo,
    setFrequencyInfo,
    isModalVisible,
    toggleModalVisible,
    setIsModalVisible,
    isTimerModalVisible,
    toggleTimerModal,
    setIsTimerModalVisible,
    setSelectedTime,
    isVoiceSettingVisible,
    toggleVoiceSettings,
    setIsVoiceSettingVisible,
    isSubscription,
    setIsSubscription,
    setSubscriptionDismissed,
    selectedPlan,
    setSelectedPlan,
    isBottomModalVisible,
    setIsBottomModalVisible,
    globalFeatures,
  } = useHomeState();

  // --- Base Audio Playback State (Hooks) ---
  const {
    isPlaying,
    position,
    duration,
    play,
    pauseMusic,
    timeLeft,
    pause,
    resume,
    isRunning,
  } = useBaseAudioPlayer();

  const sliderVolume = useAppSelector(state => state.volume.volume ?? 1);
  const currentFrequency = useAppSelector(selectCurrentFrequency);
  const nightModeFrequency = useAppSelector(
    state => state.nightMode.frequency?.[0],
  );
  const musicWheelFrequency =
    night && nightModeFrequency ? nightModeFrequency : currentFrequency;
  const backgroundFrequency =
    night && nightModeFrequency ? nightModeFrequency : currentFrequency;

  // --- Quadrant Audio Player ---
  const {playQuadrant, stopQuadrant, setVolume} = useQuadrantAudioPlayer(
    musicWheelFrequency,
    night,
    sliderVolume,
  );

  const {
    user,
    handleSubscriptionContinue,
    onBackFromExercise,
    onBackFromFrequencyInfo,
    onSelectFrequencyInfo,
    onSettingsPress,
    onPlayMusic,
    onPauseMusic,
    setNight,
    setMoodWheelItemIndex,
    onSelectSleepTimer,
    startSubscriptionReminder,
    stopSubscriptionReminder,
    handleSubscriptionClose,
  } = useHomeHandlers({
    setExercise,
    setFrequencyInfo,
    setIsSubscription,
    play,
    pauseMusic,
    resume,
    dispatch,
    setSelectedTime,
    stopQuadrant,
    selectedPlan,
    setSubscriptionDismissed,
  });
  const subscriptionPlan = user?.subscription?.plan ?? 'free';
  const expiryISO = user?.subscription?.expiry;
  const expiryDate = expiryISO ? new Date(expiryISO) : null;
  const now = new Date();
  const hasValidExpiry =
    !!expiryDate && !Number.isNaN(expiryDate.getTime());
  const isTrialActive =
    subscriptionPlan === 'free' && hasValidExpiry && expiryDate! > now;
  const disableSubscriptionClose =
    new Date(user?.subscription?.expiry ?? 0) <= now;

  const [guestVideoPromptVisible, setGuestVideoPromptVisible] = React.useState(false);
  const [lastVoiceGuide, setLastVoiceGuide] = React.useState<VoiceGuide | null>(null);
  const [lastVoiceGuideMute, setLastVoiceGuideMute] = React.useState(false);
  const [shouldMuteVoiceGuide, setShouldMuteVoiceGuide] = React.useState(false);
  const isGuestUser =
    !user ||
    user?.provider === 'guest' ||
    user?.isAnonymous ||
    user?.authType === 'guest' ||
    user?.subscription?.plan === 'guest';

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        audioController.pauseAll();
      };
    }, []),
  );

  // --- Local Shared Values ---
  const positionSV = useSharedValue(0);
  const durationSV = useSharedValue(1); // Default to 1 to avoid division errors

  useEffect(() => {
    positionSV.value = position;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  useEffect(() => {
    durationSV.value = duration || 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  // --- Navigation Handlers ---
  const handleNavigation = () => {
    setIsBottomModalVisible(true);
  };
  const handleNavigationFrequency = () => {
    navigate(routes.FREQUENCIES);
  };

  // --- Gesture Setup ---
  const panGesture = useSwipeNavigation(
    frequencyInfo,
    handleNavigation,
    handleNavigationFrequency,
  );

  const handleStartGuide = React.useCallback(
    ({guide, muteAudio}: {guide: VoiceGuide | null; muteAudio: boolean}) => {
      if (isGuestUser) {
        setGuestVideoPromptVisible(true);
      }

      if (!guide) {
        setLastVoiceGuide(null);
        setLastVoiceGuideMute(muteAudio);
        setShouldMuteVoiceGuide(muteAudio);
        // "No voice" → mantenha o MusicWheel
        return;
      }

      setLastVoiceGuide(guide);
      setLastVoiceGuideMute(muteAudio);
      setShouldMuteVoiceGuide(muteAudio);

      // 1) Se o backend já populou o exercício no guide:
      const exPopulado = (guide.exercise_id as unknown) as BreathworkExercise | undefined;
      if (exPopulado?.steps?.length) {
        setExercise(exPopulado); // MusicWheel detecta steps -> renderiza BreathCircle
        return;
      }

      // 2) Se veio só o _id, procure no cache/local (breathExercise)
      const exId = (guide as any)?.exercise_id?._id || (guide as any)?.exercise_id;
      if (exId && Array.isArray(breathExercise)) {
        const found = breathExercise.find(e => String(e._id) === String(exId));
        if (found?.steps?.length) {
          setExercise(found);
          return;
        }
      }

      // 3) fallback: (opcional) buscar do servidor ou manter wheel
      // setExercise(undefined);
    },
    [
      isGuestUser,
      setGuestVideoPromptVisible,
      setLastVoiceGuide,
      setLastVoiceGuideMute,
      setShouldMuteVoiceGuide,
      setExercise,
      breathExercise,
    ],
  );

  const handleStartLastGuide = React.useCallback(() => {
    if (!lastVoiceGuide) {
      return;
    }

    handleStartGuide({guide: lastVoiceGuide, muteAudio: lastVoiceGuideMute});
  }, [handleStartGuide, lastVoiceGuide, lastVoiceGuideMute]);

  const handleRequireSubscription = React.useCallback(() => {
    setIsVoiceSettingVisible(false);
    setIsSubscription(true);
  }, [setIsVoiceSettingVisible, setIsSubscription]);

  const handleVoiceSubscriptionRedirect = React.useCallback(() => {
    setIsVoiceSettingVisible(false);
    navigate(routes.SUBSCRIPTIONS);
  }, [setIsVoiceSettingVisible]);

  const handleGuestCtaPress = React.useCallback(() => {
    navigate(routes.SIGN_UP);
  }, []);

  useEffect(() => {
    if (!user?.subscription) {return;}

    const expiryDate = new Date(user.subscription.expiry);
    const now = new Date();

    if (user.subscription.plan === 'free' && now < expiryDate) {
      startSubscriptionReminder();
    } else if (now >= expiryDate) {
      setIsSubscription(true);
      stopSubscriptionReminder();
    }

    return () => {
      stopSubscriptionReminder();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup quadrant audio when component unmounts or navigation occurs
  useEffect(() => {
    return () => {
      stopQuadrant();
    };
  }, [stopQuadrant]);

  // Add this to your Home component
  const currentIndex = useAppSelector(
    state => state.frequencyQueue.currentIndex,
  );
  const prevCurrentIndexRef = useRef(currentIndex);

  useEffect(() => {
    // Stop quadrant audio when frequency changes (timer auto-advance)
    if (prevCurrentIndexRef.current !== currentIndex) {
      stopQuadrant();
      prevCurrentIndexRef.current = currentIndex;
    }
  }, [currentIndex, stopQuadrant]);

  const renderModalsAndSheets = () => (
    <>
      <RenderSelectionModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        breathExercise={breathExercise}
        setExercise={setExercise}
        stopQuadrant={stopQuadrant}
        pause={pause}
        timeLeft={timeLeft}
        isRunning={isRunning}
      />
      <RenderGuidedVoiceModal
        isVoiceSettingVisible={isVoiceSettingVisible}
        setIsVoiceSettingVisible={setIsVoiceSettingVisible}
        tutors={tutors}
        exerciseId={exercise?._id}
        onStartGuide={handleStartGuide}
        onRequireSubscription={handleVoiceSubscriptionRedirect}
      />
      <RenderSleepTimerModal
        isTimerModalVisible={isTimerModalVisible}
        setIsTimerModalVisible={setIsTimerModalVisible}
        handleTimerSelection={onSelectSleepTimer}
        sleepTimer={sleepTimerOptions}
      />
      <RenderSubscriptionBottomSheet
        isSubscription={isSubscription}
        setIsSubscription={handleSubscriptionClose}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        handleSubscribe={handleSubscriptionContinue}
        disableClose={disableSubscriptionClose}
        isTrialActive={isTrialActive}
      />
      <BottomHomeModal
        globalFeatures={globalFeatures}
        isVisible={isBottomModalVisible}
        onClose={() => setIsBottomModalVisible(false)}
        onRequireSubscription={handleRequireSubscription}
        isPlaying={isPlaying}
        exercise={exercise}
        onBackFromExercise={onBackFromExercise}
        play={play}
        pauseMusic={pauseMusic}
        setVolume={setVolume}
        currentFrequency={currentFrequency}
        backgroundFrequency={backgroundFrequency}
        onVoiceGuidePress={toggleVoiceSettings}
        onSharePress={onSelectFrequencyInfo}
      />
    </>
  );

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.animatedView}>
          <BackgroundWrapper
            night={night}
            currentFrequency={backgroundFrequency}>
            {frequencyInfo && <View style={styles.overlay} />}
            <SafeAreaView edges={['top', 'bottom']} style={styles.safeAreaView}>
              <Header
                exercise={exercise}
                frequencyInfo={frequencyInfo}
                onSettingsPress={onSettingsPress}
              />

              <View style={styles.content}>
                <View style={styles.playerStack}>
                  <View
                    style={[
                      styles.musicPlayerWrapper,
                      frequencyInfo && styles.musicPlayerHidden,
                    ]}>
                    <MusicPlayer
                      exercise={exercise}
                      setIsTimerModalVisible={toggleTimerModal}
                      currentFrequency={musicWheelFrequency}
                      onSelectSound={setMoodWheelItemIndex}
                      playQuadrant={playQuadrant}
                      isGuestUser={isGuestUser}
                      onGuestCtaPress={handleGuestCtaPress}
                      onStartLastGuide={handleStartLastGuide}
                      hasLastVoiceGuide={Boolean(lastVoiceGuide)}
                      muteVoiceGuide={shouldMuteVoiceGuide}
                    />
                  </View>

                  {frequencyInfo ? (
                    <View style={styles.frequencyInfoOverlay}>
                      <FrequencyInfo
                        frequencyInfo={frequencyInfo}
                        onBack={onBackFromFrequencyInfo}
                      />
                    </View>
                  ) : null}
                </View>
                {isSmallAppleScreen ? (
                  <View style={{height: widthToDP(2)}} />
                ) : null}
                <View
                  style={
                    exercise ? styles.volumeSliderExerciseSpacing : undefined
                  }>
                  <VolumeSlider setVolume={setVolume} />
                </View>
                {!frequencyInfo && (
                  <BottomButtons
                    currentFrequency={currentFrequency}
                    onInfoPress={toggleVoiceSettings}
                    onVoiceSettingPress={() =>
                      onSelectFrequencyInfo(currentFrequency)
                    }
                  />
                )}
                {isSmallAppleScreen ? (
                  <View style={{height: widthToDP(2)}} />
                ) : null}
                <PlayControls
                  exercise={exercise}
                  isPlaying={isPlaying}
                  onExerciseBack={onBackFromExercise}
                  onPlay={onPlayMusic}
                  onPause={onPauseMusic}
                  night={night}
                  onToggleNight={setNight}
                />
              </View>
              {!frequencyInfo ? (
                <ChevronButton onPress={handleNavigation} />
              ) : (
                <View style={styles.chevronPlaceholder} />
              )}
            </SafeAreaView>
          </BackgroundWrapper>
        </Animated.View>
      </GestureDetector>

      {renderModalsAndSheets()}
    </>
  );
};

export default Home;
