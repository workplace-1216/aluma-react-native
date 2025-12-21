import routes from '../../constants/routes';
import {reset as navReset} from '../../navigation/AppNavigator';
import {store} from '../../redux/store';
import {resetToken} from '../../redux/slice/authSlice';
import {resetUser} from '../../redux/slice/userSlice';
import {clearFrequencyQueue} from '../../redux/slice/frequencyQueueSlice';
import {clearSavedFrequencies} from '../../redux/slice/savedFrequenciesSlice';
import {clearSavedVideos} from '../../redux/slice/savedVideosSlice';
import {resetSubscription} from '../../redux/slice/subscriptionSlice';
import {clearMoods} from '../../redux/slice/moodSlice';
import {clearFrequencies} from '../../redux/slice/frequencySlice';
import {clearExercises} from '../../redux/slice/breathExerciseSlice';
import {clearVoiceGuides} from '../../redux/slice/voiceGuideSlice';
import {clearTutors} from '../../redux/slice/tutorSlice';
import {clearNightModeFrequency, setNightMode} from '../../redux/slice/nightModeSlice';
import showToast from '../../components/UI/CustomToast/CustomToast';

type LogoutReason = 'manual' | 'expired' | 'unknown';

let logoutInFlight = false;

export const performLogout = ({
  reason = 'unknown',
  message,
  targetRoute = routes.CONNECT,
  silent = false,
}: {
  reason?: LogoutReason;
  message?: string;
  targetRoute?: string;
  silent?: boolean;
}) => {
  if (logoutInFlight) {
    console.log('[AUTH][LOGOUT] logout already in flight, skipping duplicate call');
    return;
  }
  logoutInFlight = true;
  console.log(`[AUTH][LOGOUT] Performing logout (reason=${reason}) → ${targetRoute}`);

  const dispatch = store.dispatch;

  dispatch(resetToken());
  dispatch(resetUser());
  dispatch(clearFrequencyQueue());
  dispatch(clearSavedFrequencies());
  dispatch(clearSavedVideos());
  dispatch(resetSubscription());
  dispatch(clearMoods());
  dispatch(clearFrequencies());
  dispatch(clearExercises());
  dispatch(clearVoiceGuides());
  dispatch(clearTutors());
  dispatch(clearNightModeFrequency());
  dispatch(setNightMode(false));

  if (!silent) {
    showToast(
      message ||
        (reason === 'expired'
          ? 'Session expired. Please sign in again.'
          : 'Logged out.'),
      'info',
    );
  }

  navReset(targetRoute as any);

  setTimeout(() => {
    logoutInFlight = false;
  }, 500);
};
