import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_DEVICE_KEY = '@aluma/guest-device-id';

export async function getStoredGuestDeviceId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(GUEST_DEVICE_KEY);
  } catch {
    return null;
  }
}

export async function persistGuestDeviceId(id?: string | null) {
  if (!id) {
    return;
  }

  try {
    await AsyncStorage.setItem(GUEST_DEVICE_KEY, id);
  } catch {
    // ignore
  }
}

export async function clearStoredGuestDeviceId() {
  try {
    await AsyncStorage.removeItem(GUEST_DEVICE_KEY);
  } catch {
    // ignore
  }
}
