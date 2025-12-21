import {useRef} from 'react';
import routes from '../../constants/routes';
import {navigate} from '../../navigation/AppNavigator';
import {setMoodWheelItemCurrentIndex} from '../../redux/slice/frequencyQueueSlice';
import {FREQUENCY} from '../../redux/slice/moodSlice';
import {toggleNightAndLoad} from '../../redux/slice/nightModeSlice';
import {useAppSelector} from '../../redux/store';
import {convertToSeconds} from '../../utils/functions';
import {startSleepBackgroundTimer} from '../SleepCountdown/backgroundTimerService.ts';
import {purchasePlan, getCustomerInfoSafe, isPremium} from '../../service/billing/revenuecat';
import {setFromRC} from '../../redux/slice/subscriptionSlice';
import {RC_ENABLED} from '../../utils/env';
import showToast from '../../components/UI/CustomToast/CustomToast.tsx';
import {setUser} from '../../redux/slice/userSlice';
import {updateUser} from '../../service/auth/updateUser';
import {ENTITLEMENT_ID} from '../../constants/billing';

const useHomeHandlers = ({
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
}: {
  setExercise: (val: any) => void;
  setFrequencyInfo: (val: any) => void;
  setIsSubscription: (val: boolean) => void;
  play: () => void;
  pauseMusic: () => void;
  resume: () => void;
  dispatch: any;
  setSelectedTime: (val: string) => void;
  stopQuadrant: () => void;
  selectedPlan: 'monthly' | 'yearly';
  setSubscriptionDismissed: (val: boolean) => void;
}) => {
  const user = useAppSelector(state => state.user);
  const subscriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubscriptionContinue = async () => {
    try {
      if (!RC_ENABLED) {
        showToast('Billing disabled (missing keys). Demo mode.', {type: 'warning'});
        setIsSubscription(false);
        return;
      }

      const plan: 'monthly' | 'yearly' =
        user?.subscription?.plan === 'annual' ? 'yearly' : selectedPlan;

      showToast(`Starting purchase (${plan})...`, {type: 'normal'});

      await purchasePlan(plan);
      const info = await getCustomerInfoSafe();

      const premium = isPremium(info);
      if (premium) {
        const entitlement = info?.entitlements.active[ENTITLEMENT_ID];
        const normalizedPlan: 'monthly' | 'annual' =
          plan === 'yearly' ? 'annual' : 'monthly';

        let expiryISO = entitlement?.expirationDate ?? null;
        if (!expiryISO) {
          const computedExpiry = new Date();
          if (normalizedPlan === 'annual') {
            computedExpiry.setFullYear(computedExpiry.getFullYear() + 1);
          } else {
            computedExpiry.setMonth(computedExpiry.getMonth() + 1);
          }
          expiryISO = computedExpiry.toISOString();
        }

        const rcExpiry = expiryISO ?? undefined;
        dispatch(setFromRC({isPremium: true, plan, expiry: rcExpiry}));

        if (user?._id) {
          const updatedSubscription = {
            plan: normalizedPlan,
            expiry: expiryISO ?? user.subscription?.expiry ?? new Date().toISOString(),
          };

          dispatch(
            setUser({
              ...user,
              subscription: updatedSubscription,
            }),
          );

          try {
            await updateUser(user._id, {subscription: updatedSubscription});
          } catch (updateErr) {
            console.warn('[billing] failed to persist subscription update', updateErr);
          }
        }

        showToast('Subscription activated! 🎉', {type: 'success'});
        setSubscriptionDismissed(false);
        setIsSubscription(false);
      } else {
        showToast('Purchase did not confirm premium. Try restoring.', {type: 'warning'});
        setIsSubscription(true);
      }
    } catch (e: any) {
      console.error('[billing] purchase error', e);
      showToast(`Purchase error: ${e?.message ?? 'please try again'}`, {type: 'danger'});
      setIsSubscription(true);
    }
  };

  const onBackFromExercise = () => {
    resume();
    setExercise(undefined);
  };

  const onBackFromFrequencyInfo = () => {
    setFrequencyInfo(undefined);
  };

  const onSelectFrequencyInfo = (data: FREQUENCY) => {
    setFrequencyInfo(data);
  };

  const onSettingsPress = () => {
    navigate(routes.SETTINGS);
  };

  const onPlayMusic = () => {
    play();
  };

  const onPauseMusic = () => {
    pauseMusic();
  };

  const setNight = () => {
    dispatch(toggleNightAndLoad());
    stopQuadrant();
  };

  const setMoodWheelItemIndex = (index: number) => {
    dispatch(setMoodWheelItemCurrentIndex(index));
  };

  const onSelectSleepTimer = (value: string) => {
    setSelectedTime(value);
    const seconds = convertToSeconds(value);

    startSleepBackgroundTimer(seconds, () => {
      pauseMusic();
      stopQuadrant();
      setExercise(undefined);
    });
  };

  const startSubscriptionReminder = () => {
    if (subscriptionIntervalRef.current) {
      clearInterval(subscriptionIntervalRef.current);
    }

    subscriptionIntervalRef.current = setInterval(() => {
      const expiryISO = user?.subscription?.expiry;
      const expiryDate = expiryISO ? new Date(expiryISO) : null;
      const hasValidExpiry =
        !!expiryDate && !Number.isNaN(expiryDate.getTime());
      const now = new Date();
      const trialActive =
        (user?.subscription?.plan ?? 'free') === 'free' &&
        hasValidExpiry &&
        expiryDate! > now;

      if (!trialActive) {
        clearInterval(subscriptionIntervalRef.current as NodeJS.Timeout);
        subscriptionIntervalRef.current = null;
        return;
      }

      setSubscriptionDismissed(false);
      setIsSubscription(true);
    }, 30 * 60 * 1000);
  };

  const stopSubscriptionReminder = () => {
    if (subscriptionIntervalRef.current) {
      clearInterval(subscriptionIntervalRef.current);
      subscriptionIntervalRef.current = null;
    }
  };

  const handleSubscriptionClose = () => {
    setIsSubscription(false);

    const plan = user?.subscription?.plan;
    const expiryISO = user?.subscription?.expiry;
    const expiryDate = expiryISO ? new Date(expiryISO) : null;
    const hasValidExpiry =
      !!expiryDate && !Number.isNaN(expiryDate.getTime());
    const now = new Date();
    const isFreeWithActiveTrial =
      plan === 'free' && hasValidExpiry && expiryDate! > now;

    setSubscriptionDismissed(isFreeWithActiveTrial);

    if (isFreeWithActiveTrial) {
      startSubscriptionReminder();
    }
  };

  return {
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
  };
};

export default useHomeHandlers;
