// src/redux/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import type { Storage as PersistStorage } from 'redux-persist';
import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

// slices
import authSlice from './slice/authSlice';
import moodSlice from './slice/moodSlice';
import frequencySlice from './slice/frequencySlice';
import userSlice from './slice/userSlice';
import breathExerciseSlice from './slice/breathExerciseSlice';
import tutorSlice from './slice/tutorSlice';
import voiceGuideSlice from './slice/voiceGuideSlice';
import nightModeSlice from './slice/nightModeSlice';
import frequencyQueueSlice from './slice/frequencyQueueSlice';
import volumeSlice from './slice/volumeSlice';
import savedFrequenciesSlice from './slice/savedFrequenciesSlice';
import subscriptionSlice from './slice/subscriptionSlice';
import savedVideosSlice from './slice/savedVideosSlice';

const reducers = combineReducers({
  auth: authSlice,
  mood: moodSlice,
  frequency: frequencySlice,
  user: userSlice,
  breathExercise: breathExerciseSlice,
  tutor: tutorSlice,
  voiceGuide: voiceGuideSlice,
  nightMode: nightModeSlice,
  frequencyQueue: frequencyQueueSlice,
  volume: volumeSlice,
  savedFrequencies: savedFrequenciesSlice,
  savedVideos: savedVideosSlice,
  subscription: subscriptionSlice,
});

/** MMKV adapter para redux-persist */
const createMMKVStorage = (): PersistStorage => {
  const mmkv = new MMKV({ id: 'breathwork' /*, encryptionKey: 'optional' */ });
  return {
    setItem: async (key, value) => { mmkv.set(key, value); },
    getItem: async (key) => mmkv.getString(key) ?? null,
    removeItem: async (key) => { mmkv.delete(key); },
  };
};

/** AsyncStorage adapter para redux-persist (fallback estável sem JSI) */
const createAsyncPersistStorage = (): PersistStorage => ({
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  getItem: (key) => AsyncStorage.getItem(key),
  removeItem: (key) => AsyncStorage.removeItem(key),
});

/** Web usa localStorage; Native tenta MMKV e cai para AsyncStorage se JSI indisponível */
const storage: PersistStorage =
  Platform.OS === 'web'
    ? {
        setItem: async (k, v) => { (globalThis as any).localStorage?.setItem?.(k, v); },
        getItem: async (k) => (globalThis as any).localStorage?.getItem?.(k) ?? null,
        removeItem: async (k) => { (globalThis as any).localStorage?.removeItem?.(k); },
      }
    : (() => {
        try {
          // probe simples para garantir JSI/MMKV
          const probe = new MMKV({ id: 'probe' });
          probe.set('x', '1');
          if (probe.getString('x') !== '1') {throw new Error('jsi-probe-failed');}
          return createMMKVStorage();        // ✅ rápido no device
        } catch (e) {
          if (__DEV__) {
          console.warn('[persist] MMKV unavailable (remote debug?). Falling back to AsyncStorage.', e);
          }
          return createAsyncPersistStorage(); // ✅ estável no debug remoto
        }
      })();

/** Persist config */
const persistConfig = {
  key: 'root-mmkv-v2', // mude a chave se quiser invalidar um dia o cache
  storage,
  // Persist slices que mantêm contexto do usuário e última fila reproduzida
  whitelist: [
    'auth',
    'user',
    'savedFrequencies',
    'savedVideos',
    'nightMode',
    'subscription',
    'frequencyQueue',
    'voiceGuide',
    'volume',
    'tutor',
  ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) => gDM({ serializableCheck: false }),
});

export const persistor = persistStore(store);

// Hooks tipados
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
