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
import BottomButtons from '../../../components/Features/Home/BottomButtons/BottomButtons.tsx';
import ChevronButton from '../../../components/Features/Home/ChevronButton/ChevronButton.tsx';
import HomePlayer from '../../../components/Features/Home/HomePlayer';
import useSwipeNavigation from '../../../hooks/Home/useSwipeNavigation.ts';
import useHomeState from '../../../hooks/Home/useHomeState.ts';
import RenderSelectionModal from '../../../components/Features/Home/RenderSelectionModal/RenderSelectionModal.tsx';
import RenderGuidedVoiceModal from '../../../components/Features/Home/RenderGuidedVoiceModal/RenderGuidedVoiceModal.tsx';
import RenderSubscriptionBottomSheet from '../../../components/Features/Home/RenderSubscriptionBottomSheet/RenderSubscriptionBottomSheet.tsx';
import RenderSleepTimerModal from '../../../components/Features/Home/RenderSleepTimerModal/RenderSleepTimerModal.tsx';
import {sleepTimerOptions} from '../../../constants/sleepTimer.ts';
import useHomeHandlers from '../../../hooks/Home/useHomeHandlers.ts';
import BackgroundWrapper from '../../../components/UI/BackgroundWrapper/BackgroundWrapper.tsx';
import {useQuadrantAudioPlayer} from '../../../hooks/FrequencyPlayerHook/useQuadrantPlayer.ts';
import {useBaseAudioPlayer} from '../../../hooks/FrequencyPlayerHook/useBaseAudioPlayer.ts';
import BottomHomeModal from '../BottomHome/BottomHomeModal.tsx';
import {VoiceGuide, BreathworkExercise} from '../../../utils/types';
import {selectCurrentFrequency} from '../../../redux/selectors/frequency';
import {audioController} from '../../../services/audio/AudioController';
import {checkSubscriptionStatus} from '../../../service/billing/revenuecat';
import {setFromRC} from '../../../redux/slice/subscriptionSlice';
import {RC_ENABLED} from '../../../utils/env';

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
  // Note: These hooks are kept in Home because they're needed by modals and handlers
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
  const displayFrequency = useAppSelector(selectCurrentFrequency);

  // --- Quadrant Audio Player ---
  // Note: stopQuadrant and setVolume are needed by modals and handlers
  const {playQuadrant, stopQuadrant, setVolume} = useQuadrantAudioPlayer(
    displayFrequency,
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
  const hasValidExpiry = !!expiryDate && !Number.isNaN(expiryDate.getTime());
  const isTrialActive =
    subscriptionPlan === 'free' && hasValidExpiry && expiryDate! > now;
  const disableSubscriptionClose =
    new Date(user?.subscription?.expiry ?? 0) <= now;

  const [guestVideoPromptVisible, setGuestVideoPromptVisible] =
    React.useState(false);
  const [lastVoiceGuide, setLastVoiceGuide] = React.useState<VoiceGuide | null>(
    null,
  );
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
    (guide: VoiceGuide | null) => {
      if (isGuestUser) {
        setGuestVideoPromptVisible(true);
        return;
      }

      if (!guide) {
        setLastVoiceGuide(null);
        // "No voice" → mantenha o MusicWheel
        return;
      }

      setLastVoiceGuide(guide);

      // 1) Se o backend já populou o exercício no guide:
      const exPopulado = guide.exercise_id as unknown as
        | BreathworkExercise
        | undefined;
      if (exPopulado?.steps?.length) {
        setExercise(exPopulado); // MusicWheel detecta steps -> renderiza BreathCircle
        return;
      }

      // 2) Se veio só o _id, procure no cache/local (breathExercise)
      const exId =
        (guide as any)?.exercise_id?._id || (guide as any)?.exercise_id;
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
      setExercise,
      breathExercise,
    ],
  );

  const handleStartLastGuide = React.useCallback(() => {
    if (!lastVoiceGuide) {
      return;
    }

    handleStartGuide(lastVoiceGuide);
  }, [handleStartGuide, lastVoiceGuide]);

  const handleGuestCtaPress = React.useCallback(() => {
    navigate(routes.SIGN_UP);
  }, []);

  // Check subscription status on mount (works for both registered and anonymous users)
  useEffect(() => {
    (async () => {
      // For anonymous users, check RevenueCat directly
      if (!user?._id && RC_ENABLED) {
        try {
          const status = await checkSubscriptionStatus();
          if (status) {
            dispatch(setFromRC(status));
            console.log(
              '[Home] Subscription status checked for anonymous user:',
              status,
            );
          }
        } catch (error) {
          console.warn('[Home] Failed to check subscription status:', error);
        }
      }
    })();
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (!user?.subscription) {
      return;
    }

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

  // Stop quadrant audio when frequency changes (timer auto-advance)
  const currentIndex = useAppSelector(
    state => state.frequencyQueue.currentIndex,
  );
  const prevCurrentIndexRef = useRef(currentIndex);

  useEffect(() => {
    if (prevCurrentIndexRef.current !== currentIndex) {
      stopQuadrant();
      prevCurrentIndexRef.current = currentIndex;
    }
  }, [currentIndex, stopQuadrant]);

  const renderModalsAndSheets = () => (
    // <>
    //   <RenderSubscriptionBottomSheet
    //     isSubscription={isSubscription}
    //     setIsSubscription={handleSubscriptionClose}
    //     selectedPlan={selectedPlan}
    //     setSelectedPlan={setSelectedPlan}
    //     handleSubscribe={handleSubscriptionContinue}
    //     disableClose={disableSubscriptionClose}
    //     isTrialActive={isTrialActive}
    //   />
    // </>
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
        isPlaying={isPlaying}
        exercise={exercise}
        onBackFromExercise={onBackFromExercise}
        play={play}
        pauseMusic={pauseMusic}
        setVolume={setVolume}
        currentFrequency={displayFrequency}
        onVoiceGuidePress={toggleVoiceSettings}
        onSharePress={onSelectFrequencyInfo}
      />
    </>
  );

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.animatedView}>
          <BackgroundWrapper night={night} currentFrequency={displayFrequency}>
            {frequencyInfo && <View style={styles.overlay} />}
            <SafeAreaView edges={['top', 'bottom']} style={styles.safeAreaView}>
              <Header
                exercise={exercise}
                frequencyInfo={frequencyInfo}
                onSettingsPress={onSettingsPress}
              />

              <View style={styles.content}>
                {frequencyInfo ? (
                  <FrequencyInfo
                    frequencyInfo={frequencyInfo}
                    onBack={onBackFromFrequencyInfo}
                  />
                ) : (
                  <>
                    <HomePlayer
                      exercise={exercise}
                      night={night}
                      setNight={setNight}
                      setMoodWheelItemIndex={setMoodWheelItemIndex}
                      onBackFromExercise={onBackFromExercise}
                      setIsTimerModalVisible={toggleTimerModal}
                      isGuestUser={isGuestUser}
                      onGuestCtaPress={handleGuestCtaPress}
                      onStartLastGuide={handleStartLastGuide}
                      lastVoiceGuide={lastVoiceGuide}
                      currentFrequency={displayFrequency}
                      isPlaying={isPlaying}
                      onPlayMusic={onPlayMusic}
                      onPauseMusic={onPauseMusic}
                      playQuadrant={playQuadrant}
                      setVolume={setVolume}
                    />
                    {!frequencyInfo && (
                      <BottomButtons
                        currentFrequency={displayFrequency}
                        onInfoPress={toggleVoiceSettings}
                        onVoiceSettingPress={() =>
                          onSelectFrequencyInfo(displayFrequency)
                        }
                      />
                    )}
                  </>
                )}
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
