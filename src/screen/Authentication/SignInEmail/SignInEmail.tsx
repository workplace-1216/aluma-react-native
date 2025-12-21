import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {SvgLock, SvgMail} from '../../../assets/svg';
import {navigate, reset} from '../../../navigation/AppNavigator';
import KeyboardContainer from '../../../components/layout/KeyboardContainer';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import routes from '../../../constants/routes';
import {login} from '../../../service/auth/login';
import {useAppDispatch} from '../../../redux/store';
import {setToken} from '../../../redux/slice/authSlice';
import {setUser} from '../../../redux/slice/userSlice';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {getFcmToken} from '../../../utils/getFcmToken';
import {syncFcmTokenWithBackend} from '../../../services/notifications/syncFcmToken';
import {fetchAllGuidedVoiceSettings} from '../../../service/tutors/fetchAllGuidedVoiceSettings';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';
import {fetchAllExercises} from '../../../service/exercise/getAllExercise';
import {fetchAllGuidedVoice} from '../../../service/guide/gettAllGuideVoice';
import {fetchNightMode} from '../../../service/nightMode/getNightMode';
import {fetchFirstMoodWithFrequency} from '../../../service/mood/getFirstMood';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SignInEmail: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const keyboardVerticalOffset = useMemo(
    () => (insets?.top ?? 0) + 48, // header height + status bar
    [insets?.top],
  );

  const navigateForgotPassword = () => {
    navigate(routes.FORGOT_PASSWORD);
  };

  const navigateHome = () => {
    reset(routes.HOME);
  };

  const handleLogin = async () => {
    setErrorMessage('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const fcmToken = await getFcmToken();
      console.log('fcmtoken>>>', fcmToken);
      if (!fcmToken) {
        setErrorMessage('Failed to get FCM token');
        return;
      }

      const response = await login({email, password, fcmToken});
      await syncFcmTokenWithBackend(fcmToken);
      const user = response?.user;
      const token = response?.tokens?.access;
      if (!token) {
        return;
      }
      console.log({user});
      dispatch(setToken(token));
      dispatch(fetchAllExercises());
      dispatch(fetchAllGuidedVoice());
      dispatch(fetchAllGuidedVoiceSettings());
      dispatch(fetchNightMode());
      dispatch(fetchFirstMoodWithFrequency());
      dispatch(setUser(user));
      showToast('Logged In Successfully!');
      navigateHome();
    } catch (error: any) {
      console.log('error', error);
      if (error.data && error.data.message) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardContainer
      scrollEnabled
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={styles.container}>
        <BackHeader showBackBtn />
        <AuthContainer
          handlePress={handleLogin}
          loading={loading}
          buttonText="Log in"
          showFooterBtn
          error={`${errorMessage}`}
         showForgetPasswordBtn
          navigateForgotPassword={navigateForgotPassword}>
          <CustomTextInput
            Icon={SvgMail}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <CustomTextInput
            Icon={SvgLock}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </AuthContainer>
      </View>
    </KeyboardContainer>
  );
};

export default SignInEmail;
