import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {ReduxProvider} from './src/redux/provider';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from './src/redux/store';
import {ToastProvider} from 'react-native-toast-notifications';
import BootstrapRevenueCat from './src/components/BootstrapRevenueCat'; // ✅
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {initializeNotificationService} from './src/services/notifications/NotificationService';
import {syncFcmTokenWithBackend} from './src/services/notifications/syncFcmToken';
import AppLoadingScreen from './src/components/UI/AppLoadingScreen/AppLoadingScreen';
import {NetworkProvider} from './src/context/NetworkProvider';
import NetworkStatusBanner from './src/components/UI/NetworkStatusBanner';

function App() {
  React.useEffect(() => {
    syncFcmTokenWithBackend().catch(() => {});
    const cleanup = initializeNotificationService();
    return cleanup;
  }, []);

  React.useEffect(() => {
    console.log('[APP][BOOT] Waiting for Redux rehydration');
  }, []);

  const handleBeforeLift = React.useCallback(() => {
    console.log('[APP][BOOT] Redux rehydration complete');
  }, []);

  return (
    <ReduxProvider>
      <PersistGate
        loading={<AppLoadingScreen />}
        persistor={persistor}
        onBeforeLift={handleBeforeLift}>
        <SafeAreaProvider>
          <StatusBar translucent backgroundColor="transparent" />
          <ToastProvider>
            <NetworkProvider>
              <NetworkStatusBanner />
              <BootstrapRevenueCat />
              <AppNavigator />
            </NetworkProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
