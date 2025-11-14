import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@app/device-id';

const simpleUUID = () => {
  return (
    'dev-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  );
};

export default async function createPersistentDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existing) {
      return existing;
    }

    const fresh = simpleUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, fresh);
    return fresh;
  } catch {
    return simpleUUID();
  }
}
