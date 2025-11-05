import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {register} from './register';
import {getFcmToken} from '../../utils/getFcmToken';

export async function googleSignOut() {
  await GoogleSignin.revokeAccess();
  await GoogleSignin.signOut();
}

async function signUpWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();

    // Try the new style of google-sign in result, from v13+ of that module
    console.log('result', signInResult);
    let idToken = signInResult.data?.idToken;

    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult?.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }

    const fcmToken = await getFcmToken();
    console.log('fcmtoken',fcmToken);
    if (!fcmToken) {
      throw new Error('No FCM token found');
    }
    // Sign-in the user with the credential
    const user = await register({
      googleToken: idToken,
      fcmToken: fcmToken,
      purpose: 'signUp',
      signUpType: 'google',
    });
    console.log('user', user);
    return user;
  } catch (error: any) {
    console.log('error api',error);
    return error.response;
  }
  // Check if your device supports Google Play
}
export default signUpWithGoogle;
