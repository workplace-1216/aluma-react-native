import {useEffect, useState} from 'react';
import {useAppSelector} from '../../redux/store';
import {BreathworkExercise, SubscriptionPlan} from '../../utils/types';
import {FREQUENCY} from '../../redux/slice/moodSlice';
import useToggle from '../General/useToggle';
import {userSessions} from '../../service/users/getUserSessions';
import {setUser} from '../../redux/slice/userSlice';
import {clearSavedVideos, setSavedVideos} from '../../redux/slice/savedVideosSlice';
import {getSavedVideos} from '../../service/video/getSavedVideos';
import {useDispatch} from 'react-redux';
import {needsRefresh} from '../../utils/functions';
import {InteractionManager} from 'react-native';
import {setMoods} from '../../redux/slice/moodSlice';
import {setFrequencies} from '../../redux/slice/frequencySlice';
import {getMoodsAll} from '../../service/mood/getMoodsAlll';
import {getAllFrequencies} from '../../service/frequency/getAllFrequencies';
import {fetchGlobalFeaturesOnce} from '../../service/global/fetchGlobalFeaturesOnce';
import {requireOnline} from '../../services/network/networkState';

// Inline useHomeState hook
export const useHomeState = () => {
  const dispatch = useDispatch();
  const night = useAppSelector(state => state.nightMode.isNightMode);
  const breathExercise = useAppSelector(
    state => state.breathExercise.allExercises,
  );
  const tutors = useAppSelector(state => state.tutor.allTutors);
  const queue = useAppSelector(state => state.frequencyQueue.queue);
  const currentIndex = useAppSelector(
    state => state.frequencyQueue.currentIndex,
  );
  const user = useAppSelector(state => state.user);
  const userId = user?._id;
  const rcIsPremium = useAppSelector(state => state.subscription.isPremium);
  const savedVideos = useAppSelector(state => state.savedVideos.savedVideos);
  const savedVideosLastUpdated = useAppSelector(
    state => state.savedVideos.lastUpdated,
  );
  const moodsLastUpdated = useAppSelector(state => state.mood.lastUpdated);
  const frequencyLastUpdated = useAppSelector(
    state => state.frequency.lastUpdated,
  );

  const globalFeaturesState = useAppSelector(state => state.globalFeatures);
  const globalFeatures = globalFeaturesState.data ?? undefined;
  const globalFeaturesStatus = globalFeaturesState.status;
  const globalFeaturesError = globalFeaturesState.error;

  const [exercise, setExercise] = useState<BreathworkExercise>();
  const [frequencyInfo, setFrequencyInfo] = useState<FREQUENCY>();
  const [isModalVisible, toggleModalVisible, setIsModalVisible] =
    useToggle(false);
  const [isTimerModalVisible, toggleTimerModal, setIsTimerModalVisible] =
    useToggle(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isVoiceSettingVisible, toggleVoiceSettings, setIsVoiceSettingVisible] =
    useToggle(false);
  const [isSubscription, setIsSubscription] = useState<boolean>(() => {
    const plan = user?.subscription?.plan ?? 'free';
    const expiryISO = user?.subscription?.expiry;
    const expiryDate = expiryISO ? new Date(expiryISO) : null;
    const hasValidExpiry =
      !!expiryDate && !Number.isNaN(expiryDate.getTime());
    const now = new Date();
    const isFreeWithActiveTrial =
      plan === 'free' && hasValidExpiry && expiryDate! > now;
    const hasExpired =
      plan === 'free' && hasValidExpiry && expiryDate! <= now;

    if (isFreeWithActiveTrial) {
      return false;
    }

    if (hasExpired) {
      return false;
    }

    return true;
  });
  const [subscriptionDismissed, setSubscriptionDismissed] =
    useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);

  const currentFrequency: FREQUENCY = queue[currentIndex];

  const fetchUserSessions = async () => {
    try {
      const response = await userSessions();
      const newSessions = response?.sessions;
      if (!newSessions) {
        return;
      }

      const currentSessions = user?.sessions;
      const hasChanged =
        !currentSessions ||
        currentSessions.count !== newSessions.count ||
        currentSessions.lastSessionDate !== newSessions.lastSessionDate;

      if (!hasChanged) {
        return;
      }

      dispatch(setUser({...user, sessions: newSessions}));
    } catch (error) {
      console.error('Failed to fetch user sessions:', error);
    }
  };

  useEffect(() => {
    if (
      requireOnline({
        actionName: 'global features',
        showMessage: false,
      })
    ) {
      fetchGlobalFeaturesOnce(dispatch).catch(error => {
        console.log('[useHomeState] fetchGlobalFeaturesOnce failed', error);
      });
    }

    if (
      requireOnline({
        actionName: 'user sessions',
        showMessage: false,
      })
    ) {
      fetchUserSessions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadSavedVideos = async () => {
      if (!userId) {
        dispatch(clearSavedVideos());
        return;
      }

      if (savedVideos.length > 0 && !needsRefresh(savedVideosLastUpdated)) {
        return;
      }

      if (
        !requireOnline({
          actionName: 'saved videos',
          showMessage: false,
        })
      ) {
        return;
      }

      try {
        const response = await getSavedVideos();
        const rawList = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        if (!mounted) {return;}

        const mapped = rawList.map((item: any) => ({
          id: item?.id || item?.video_id || item?.url,
          savedId: item?.savedId || item?._id,
          url: item?.url,
          title: item?.title,
          subtitle: item?.subtitle,
          frequencyId: item?.frequencyId || item?.frequency_id,
          frequencyTitle: item?.frequencyTitle || item?.frequency_title,
          background: item?.background || item?.thumbnail,
          savedAt: item?.savedAt
            ? new Date(item.savedAt).getTime()
            : Date.now(),
        }));

        dispatch(setSavedVideos(mapped));
      } catch (error) {
        console.error('Failed to load saved videos:', error);
      }
    };

    loadSavedVideos();

    return () => {
      mounted = false;
    };
  }, [dispatch, userId, savedVideos.length, savedVideosLastUpdated]);

  useEffect(() => {
    if (
      !needsRefresh(moodsLastUpdated) &&
      !needsRefresh(frequencyLastUpdated)
    ) {
      return;
    }
      const task = InteractionManager.runAfterInteractions(() => {
        if (
          needsRefresh(moodsLastUpdated) &&
          requireOnline({
            actionName: 'moods fetch',
            showMessage: false,
          })
        ) {
          getMoodsAll()
            .then(response => dispatch(setMoods(response?.data ?? [])))
            .catch(err => console.error('Background moods refresh failed:', err));
        }
        if (
          needsRefresh(frequencyLastUpdated) &&
          requireOnline({
            actionName: 'frequencies fetch',
            showMessage: false,
          })
        ) {
          getAllFrequencies()
            .then(response => dispatch(setFrequencies(response?.data ?? [])))
            .catch(err =>
              console.error('Background frequencies refresh failed:', err),
            );
        }
      });

    return () => {
      task.cancel?.();
    };
  }, [dispatch, moodsLastUpdated, frequencyLastUpdated]);

  useEffect(() => {
    const planFromBackend = user?.subscription?.plan ?? 'free';
    const expiryISO = user?.subscription?.expiry;
    const expiryDate = expiryISO ? new Date(expiryISO) : null;
    const now = new Date();
    const hasValidExpiry =
      !!expiryDate && !Number.isNaN(expiryDate.getTime());
    const isFreeWithActiveTrial =
      planFromBackend === 'free' && hasValidExpiry && expiryDate! > now;

    const shouldShowModal =
      !rcIsPremium && planFromBackend === 'free' && isFreeWithActiveTrial;

    if (!shouldShowModal) {
      if (isSubscription) {
        setIsSubscription(false);
      }
      if (subscriptionDismissed) {
        setSubscriptionDismissed(false);
      }
      return;
    }

    if (subscriptionDismissed) {
      return;
    }

    if (!isSubscription) {
      setIsSubscription(true);
    }
  }, [
    isSubscription,
    rcIsPremium,
    subscriptionDismissed,
    user?.subscription?.plan,
    user?.subscription?.expiry,
  ]);

  return {
    night,
    breathExercise,
    tutors,
    queue,
    currentIndex,
    currentFrequency,
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
    selectedTime,
    setSelectedTime,
    isVoiceSettingVisible,
    toggleVoiceSettings,
    setIsVoiceSettingVisible,
    isSubscription,
    setIsSubscription,
    subscriptionDismissed,
    setSubscriptionDismissed,
    selectedPlan,
    setSelectedPlan,
    isBottomModalVisible,
    setIsBottomModalVisible,
    globalFeatures,
    globalFeaturesStatus,
    globalFeaturesError,
  };
};

export default useHomeState;
