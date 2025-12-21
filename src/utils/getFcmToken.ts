import {getApp} from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export const getFcmToken = async () => {
  const messaging = getMessaging(getApp());

  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
        return 'dummyToken';
      }
    } else if (Platform.OS === 'ios') {
      const authStatus = await requestPermission(messaging);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        console.log('iOS notification permission denied');
        return 'dummyToken';
      }
    }

    const fcmToken = await getToken(messaging);

    return fcmToken || 'dummyToken';
  } catch (error) {
    console.warn('🔥 FCM token error:', error);
    return 'dummyToken';
  }
};
