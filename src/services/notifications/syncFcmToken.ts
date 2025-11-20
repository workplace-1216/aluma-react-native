import {store} from '../../redux/store';
import {attachFcmToken} from '../../service/auth/guestLogin';
import {getFcmToken} from '../../utils/getFcmToken';

let lastSyncedToken: string | null = null;

export const syncFcmTokenWithBackend = async (forcedToken?: string) => {
  const state = store.getState();
  const userId = state.user?._id;
  if (!userId) {return;}

  const token = forcedToken ?? (await getFcmToken());
  if (!token || token === 'dummyToken') {return;}

  if (lastSyncedToken === token) {return;}

  try {
    await attachFcmToken(token);
    lastSyncedToken = token;
  } catch (error) {
    console.warn('[notifications] Failed to sync FCM token', error);
  }
};
