import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {ReduxProvider} from './src/redux/provider';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from './src/redux/store';
import {ToastProvider} from 'react-native-toast-notifications';
import BootstrapRevenueCat from './src/components/BootstrapRevenueCat'; // ✅
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';

function App() {
  return (
    <ReduxProvider>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar translucent backgroundColor="transparent" />
          <ToastProvider>
            {/* inicializa RevenueCat (no-op sem keys) */}
            <BootstrapRevenueCat />
            <AppNavigator />
          </ToastProvider>
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
