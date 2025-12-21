/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {handleRemoteMessage} from './src/services/notifications/NotificationService';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await handleRemoteMessage(remoteMessage, {origin: 'background'});
});

AppRegistry.registerComponent(appName, () => App);
