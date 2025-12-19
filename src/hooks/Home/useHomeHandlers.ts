import {useRef} from 'react';
import routes from '../../constants/routes';
import {navigate} from '../../navigation/AppNavigator';
import {setMoodWheelItemCurrentIndex} from '../../redux/slice/frequencyQueueSlice';
import {FREQUENCY} from '../../redux/slice/moodSlice';
import {toggleNightAndLoad} from '../../redux/slice/nightModeSlice';
import {useAppSelector} from '../../redux/store';
import {convertToSeconds} from '../../utils/functions';
import {startSleepBackgroundTimer} from '../SleepCountdown/backgroundTimerService.ts';
import { purchasePlan, getCustomerInfoSafe, isPremium } from '../../service/billing/revenuecat';
import { setFromRC } from '../../redux/slice/subscriptionSlice';
import { RC_ENABLED, RC_API_KEY_ANDROID, RC_API_KEY_IOS } from '../../utils/env';
import showToast from '../../components/UI/CustomToast/CustomToast.tsx';
import { setUser } from '../../redux/slice/userSlice';
import { updateUser } from '../../service/auth/updateUser';
import { ENTITLEMENT_ID } from '../../constants/billing';
import {audioController} from '../../services/audio/AudioController';
import { Platform } from 'react-native';

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
  const isProcessingPurchaseRef = useRef(false);

  const handleSubscriptionContinue = async () => {
    // Prevent multiple simultaneous purchase attempts
    if (isProcessingPurchaseRef.current) {
      console.log('[billing] Purchase already in progress, ignoring duplicate request');
      return;
    }

    isProcessingPurchaseRef.current = true;
  try {
    // no RC: close and warn
    if (!RC_ENABLED) {
      showToast('Billing disabled (missing keys). Demo mode.', 'info');
      setIsSubscription(false);
      isProcessingPurchaseRef.current = false;
      return;
    }

    // Check if RevenueCat is configured for current platform
    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    if (!apiKey || apiKey.trim().length === 0) {
      console.error(`[billing] RevenueCat API key missing for ${Platform.OS}`);
      console.error(`[billing] iOS key exists: ${!!RC_API_KEY_IOS}, Android key exists: ${!!RC_API_KEY_ANDROID}`);
      showToast(`RevenueCat API key missing for ${Platform.OS}. Please add RC_API_KEY_ANDROID to your environment variables.`, 'error');
      setIsSubscription(false);
      isProcessingPurchaseRef.current = false;
      return;
    }

    // Ensure plan: if the user previously had annual, force yearly; otherwise use the selectedPlan
    const plan: 'monthly' | 'yearly' =
      user?.subscription?.plan === 'annual' ? 'yearly' : selectedPlan;

    showToast(`Processing ${plan} subscription...`, 'info');

    // Purchase and get customerInfo directly from the purchase response
    const { customerInfo } = await purchasePlan(plan);
    
    // Use customerInfo from purchase, or fetch if not available
    let info = customerInfo;
    if (!info) {
      console.log('[billing] Purchase completed but no customerInfo, fetching...');
      // Wait a moment for RevenueCat to sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      info = await getCustomerInfoSafe();
    }

    if (!info) {
      showToast('Purchase completed but unable to verify. Please try restoring purchases.', 'info');
      setIsSubscription(true);
      isProcessingPurchaseRef.current = false;
      return;
    }

    const premium = isPremium(info);
    if (premium) {
      const entitlement = info.entitlements.active[ENTITLEMENT_ID];
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
      dispatch(setFromRC({ isPremium: true, plan, expiry: rcExpiry }));

      // Update user subscription if user is registered (optional)
      if (user?._id) {
        const updatedSubscription = {
          plan: normalizedPlan,
          expiry: expiryISO ?? user.subscription?.expiry ?? new Date().toISOString(),
        };

        dispatch(
          setUser({
            ...user,
            subscription: updatedSubscription,
          })
        );

        try {
          await updateUser(user._id, { subscription: updatedSubscription });
        } catch (updateErr) {
          console.warn('[billing] failed to persist subscription update', updateErr);
        }
      } else {
        // User purchased without registration - show optional registration prompt
        // Registration enables cross-device access but is not required
        showToast('Subscription activated! 🎉 Register to access on all your devices.', 'success');
        setSubscriptionDismissed(false);
        setIsSubscription(false);
        isProcessingPurchaseRef.current = false;
        return; // Early return to show success message
      }

      showToast('Subscription activated! 🎉', 'success');
      setSubscriptionDismissed(false);
      setIsSubscription(false);
    } else {
      showToast('Purchase did not confirm premium. Try restoring.', 'info');
      setIsSubscription(true);
    }
    isProcessingPurchaseRef.current = false;
  } catch (e: any) {
    isProcessingPurchaseRef.current = false;
    const errorMessage = e?.message || e?.userInfo?.NSLocalizedDescription || 'please try again';

    // Check if this is a user cancellation (case-insensitive, various forms)
    const isCancellation =
      errorMessage.toLowerCase().includes('cancel') ||
      errorMessage.toLowerCase().includes('cancelled') ||
      errorMessage.toLowerCase().includes('cancellation') ||
      e?.code === 'PURCHASE_CANCELLED' ||
      e?.userCancelled === true;

    if (isCancellation) {
      // User cancelled - this is expected behavior, just log as info
      console.log('[billing] Purchase was cancelled by user');
      // Don't show error toast or keep modal open for cancellations
      setIsSubscription(false);
    } else {
      // Actual error - log and show to user
      console.error('[billing] purchase error', e);
      showToast(`Purchase error: ${errorMessage}`, 'error');
      setIsSubscription(true);
    }
  } finally {
    isProcessingPurchaseRef.current = false;
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
    audioController.pauseAll();
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

  // Function to start subscription reminder interval
  const startSubscriptionReminder = () => {
    // Clear existing interval if any
    if (subscriptionIntervalRef.current) {
      clearInterval(subscriptionIntervalRef.current);
    }

    // Start new interval
    subscriptionIntervalRef.current = setInterval(() => {
      setSubscriptionDismissed(false);
      setIsSubscription(true);
    }, 30 * 60 * 1000); // 30 minutes
  };

  // Function to stop subscription reminder interval
  const stopSubscriptionReminder = () => {
    if (subscriptionIntervalRef.current) {
      clearInterval(subscriptionIntervalRef.current);
      subscriptionIntervalRef.current = null;
    }
  };

  // Handle subscription close - restart timer
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
