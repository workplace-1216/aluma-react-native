import { getMessaging, getToken, requestPermission } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { PermissionsAndroid, Platform } from 'react-native';

export const getFcmToken = async () => {
  try {
    // Request notification permission on Android (API 33+)
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
        return 'dummyToken';
      }
    }

    const messagingInstance = getMessaging(getApp());

    // Request permission only on iOS
    if (Platform.OS === 'ios') {
      await requestPermission(messagingInstance);
    }

    const fcmToken = await getToken(messagingInstance);

    return fcmToken || 'dummyToken';
  } catch (error) {
    console.warn('🔥 FCM token error:', error);
    return 'dummyToken';
  }
};
