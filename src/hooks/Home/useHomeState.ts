import {useEffect, useState} from 'react';
import {useAppSelector} from '../../redux/store';
import {BreathworkExercise, SubscriptionPlan} from '../../utils/types';
import {FREQUENCY} from '../../redux/slice/moodSlice';
import useToggle from '../General/useToggle';
import {getAllGlobalData} from '../../service/global/getGlobalData';
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

export interface WeeklyTipVideo {
  _id?: string;
  title?: string;
  subtitle?: string;
  url?: string;
  cover_url?: string;
  thumbnail?: string;
}

export interface GlobalFeatures {
  weekly_tip: string;
  ujjayi_breathe: string;
  bottom_left_corner_quote: string;
  weekly_tip_videos?: WeeklyTipVideo[];
}

const GLOBAL_FEATURES_TTL = 10 * 60 * 1000;
let cachedGlobalFeatures:
  | {
      data: GlobalFeatures;
      timestamp: number;
    }
  | null = null;

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

  const [exercise, setExercise] = useState<BreathworkExercise>();
  const [frequencyInfo, setFrequencyInfo] = useState<FREQUENCY>();
  const [isModalVisible, toggleModalVisible, setIsModalVisible] =
    useToggle(false);
  const [isTimerModalVisible, toggleTimerModal, setIsTimerModalVisible] =
    useToggle(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isVoiceSettingVisible, toggleVoiceSettings, setIsVoiceSettingVisible] =
    useToggle(false);
  const [isSubscription, setIsSubscription] = useState<boolean>(true);
  const [subscriptionDismissed, setSubscriptionDismissed] =
    useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);

  const currentFrequency: FREQUENCY = queue[currentIndex];

  const [globalFeatures, setGlobalFeatures] = useState<GlobalFeatures>();

  const getGlobalFeatures = async () => {
    const now = Date.now();
    if (
      cachedGlobalFeatures &&
      now - cachedGlobalFeatures.timestamp < GLOBAL_FEATURES_TTL
    ) {
      if (!globalFeatures) {
        setGlobalFeatures(cachedGlobalFeatures.data);
      }
      return;
    }

    try {
      const response = await getAllGlobalData();
      const data = (response?.data ?? response) as GlobalFeatures | undefined;
      if (!data) {
        return;
      }

      cachedGlobalFeatures = {data, timestamp: now};
      setGlobalFeatures(prev => {
        if (!prev) {
          return data;
        }

        const videosSame =
          JSON.stringify(prev.weekly_tip_videos ?? []) ===
          JSON.stringify(data.weekly_tip_videos ?? []);

        if (
          prev.weekly_tip === data.weekly_tip &&
          prev.ujjayi_breathe === data.ujjayi_breathe &&
          prev.bottom_left_corner_quote === data.bottom_left_corner_quote &&
          videosSame
        ) {
          return prev;
        }
        return data;
      });
    } catch (error) {
      console.log(error);
    }
  };

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
    getGlobalFeatures();
    fetchUserSessions();
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
      if (needsRefresh(moodsLastUpdated)) {
        getMoodsAll()
          .then(response => dispatch(setMoods(response?.data ?? [])))
          .catch(err => console.error('Background moods refresh failed:', err));
      }
      if (needsRefresh(frequencyLastUpdated)) {
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
    const hasExpired = hasValidExpiry ? expiryDate! <= now : false;
    const isFreeWithActiveTrial =
      planFromBackend === 'free' && hasValidExpiry && expiryDate! > now;

    const shouldShowModal =
      !rcIsPremium && (planFromBackend === 'free' || hasExpired);

    if (!shouldShowModal) {
      if (isSubscription) {
        setIsSubscription(false);
      }
      if (subscriptionDismissed) {
        setSubscriptionDismissed(false);
      }
      return;
    }

    if (subscriptionDismissed && isFreeWithActiveTrial) {
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
    setGlobalFeatures,
  };
};

export default useHomeState;
