import {AppDispatch} from '../../redux/store';
import {setToken} from '../../redux/slice/authSlice';
import {setUser} from '../../redux/slice/userSlice';
import {guestLogin} from '../../service/auth/guestLogin';
import createPersistentDeviceId from '../../utils/createPersistentDeviceId';
import {getFcmToken} from '../../utils/getFcmToken';
import {syncFcmTokenWithBackend} from '../../services/notifications/syncFcmToken';
import {
  getStoredGuestDeviceId,
  persistGuestDeviceId,
} from '../../utils/guestDeviceStorage';
import {fetchAllExercises} from '../../service/exercise/getAllExercise';
import {fetchAllGuidedVoice} from '../../service/guide/gettAllGuideVoice';
import {fetchAllGuidedVoiceSettings} from '../../service/tutors/fetchAllGuidedVoiceSettings';
import {fetchNightMode} from '../../service/nightMode/getNightMode';
import {fetchFirstMoodWithFrequency} from '../../service/mood/getFirstMood';

export const bootstrapAfterAuth = (dispatch: AppDispatch) => {
  dispatch(fetchAllExercises());
  dispatch(fetchAllGuidedVoice());
  dispatch(fetchAllGuidedVoiceSettings());
  dispatch(fetchNightMode());
  dispatch(fetchFirstMoodWithFrequency());
};

type GuestLoginOptions = {
  dispatch: AppDispatch;
  overrideGuestId?: string | null;
};

export const loginGuestSession = async ({
  dispatch,
  overrideGuestId,
}: GuestLoginOptions) => {
  const [storedGuestDeviceId, deviceId] = await Promise.all([
    overrideGuestId
      ? Promise.resolve(overrideGuestId)
      : getStoredGuestDeviceId(),
    createPersistentDeviceId(),
  ]);

  let fcmToken: string | undefined;
  try {
    const token = await getFcmToken();
    if (token && token !== 'dummyToken') {
      fcmToken = token;
    }
  } catch (error) {
    console.warn('Unable to get FCM token for guest login', error);
  }

  const response = await guestLogin({
    guestDeviceId: storedGuestDeviceId ?? undefined,
    deviceId,
    fcmToken,
  });

  const user = response?.user;
  const token = response?.tokens?.access;

  if (!user || !token) {
    throw new Error('Guest login failed');
  }

  if (user?.guestDeviceId) {
    await persistGuestDeviceId(user.guestDeviceId);
  }

  dispatch(setToken(token));
  dispatch(setUser(user));

  if (fcmToken) {
    syncFcmTokenWithBackend(fcmToken).catch(() => {});
  }

  bootstrapAfterAuth(dispatch);

  return {user, token};
};
