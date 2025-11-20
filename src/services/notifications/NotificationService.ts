import messaging, {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {syncFcmTokenWithBackend} from './syncFcmToken';

const CHANNEL_ID = 'breathwork_default';

export const ensureNotificationChannel = async () => {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Breathwork',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};

export const showLocalNotification = async ({
  title,
  body,
  data,
}: {
  title: string;
  body: string;
  data?: Record<string, string>;
}) => {
  await ensureNotificationChannel();
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: CHANNEL_ID,
      pressAction: {id: 'default'},
    },
    data,
  });
};

export const handleRemoteMessage = async (
  message: FirebaseMessagingTypes.RemoteMessage,
  {origin}: {origin: 'foreground' | 'background'} = {origin: 'foreground'},
) => {
  const {notification, data} = message;

  if (data?.type === 'reminder') {
    const title = data.title || 'Mindful reminder';
    const body =
      data.body ||
      `Take a moment to breathe${data.context ? ` – ${data.context}` : ''}.`;
    await showLocalNotification({title, body, data});
    return;
  }

  if (notification) {
    await showLocalNotification({
      title: notification.title || 'Aluma Breath',
      body: notification.body || '',
      data,
    });
  }
};

export const initializeNotificationService = () => {
  ensureNotificationChannel();

  const unsubscribeOnMessage = messaging().onMessage(async message => {
    await handleRemoteMessage(message, {origin: 'foreground'});
  });

  const unsubscribeNotificationOpened =
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data?.deeplink) {
        // TODO: integrate navigation / linking
      }
    });

  messaging()
    .getInitialNotification()
    .then(initialMessage => {
      if (initialMessage?.data?.deeplink) {
        // TODO: handle initial deeplink navigation
      }
    });

  const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
    syncFcmTokenWithBackend(token);
  });

  return () => {
    unsubscribeOnMessage();
    unsubscribeNotificationOpened();
    unsubscribeTokenRefresh();
  };
};
