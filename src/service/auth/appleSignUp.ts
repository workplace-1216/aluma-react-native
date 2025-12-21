import { getFcmToken } from '../../utils/getFcmToken';
import axiosInstance from '../axiosInstance';

async function signUpWithApple(data: any) {
  try {
    const fcmToken = await getFcmToken();
    if (!fcmToken) {
      throw new Error('No FCM token found');
    }
    const allData = { ...data, fcmToken };
    console.log(allData);
    const response = await axiosInstance.post('/auth/apple-signin', allData);
    console.log('user', response.data);
    return response.data;
  } catch (error: any) {
    console.log('error api', error);
    return error.response;
  }
  // Check if your device supports Google Play
}

export default signUpWithApple;
