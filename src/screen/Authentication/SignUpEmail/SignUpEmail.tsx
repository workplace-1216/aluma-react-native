import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {SvgLock, SvgMail, SvgProfile} from '../../../assets/svg';
import {reset} from '../../../navigation/AppNavigator';
import KeyboardContainer from '../../../components/layout/KeyboardContainer';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import routes from '../../../constants/routes';
import {register} from '../../../service/auth/register';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {setToken} from '../../../redux/slice/authSlice';
import {setUser} from '../../../redux/slice/userSlice';
import {RouteProp, useRoute} from '@react-navigation/native';
import {getFcmToken} from '../../../utils/getFcmToken';
import {fetchAllGuidedVoiceSettings} from '../../../service/tutors/getAllTutors';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';
import {fetchAllExercises} from '../../../service/exercise/getAllExercise';
import {fetchAllGuidedVoice} from '../../../service/guide/gettAllGuideVoice';
import {fetchNightMode} from '../../../service/nightMode/getNightMode';
import {fetchFirstMoodWithFrequency} from '../../../service/mood/getFirstMood';
import {convertGuestToEmail} from '../../../service/auth/convertGuest';
import {setPurposeAPI} from '../../../service/auth/setPurpose';

type SignUpEmailRouteParams = {
  SignUpEmail: {
    purpose: string;
  };
};

const SignUpEmail: React.FC = () => {
  const route = useRoute<RouteProp<SignUpEmailRouteParams, 'SignUpEmail'>>();
  const purpose = route.params?.purpose;

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user);
  const isGuestUser =
    currentUser?.provider === 'guest' || currentUser?.isAnonymous;

  const handleSignUp = async () => {
    setErrorMessage('');

    // Validate empty fields
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill all fields');
      return;
    }

    // Validate full name (expect at least first and last name)
    // const nameParts = name.trim().split(' ');
    // if (nameParts.length < 2) {
    //   setErrorMessage('Please enter your full name (first and last)');
    //   return;
    // }
    // const firstName = nameParts[0];
    // const lastName = nameParts.slice(1).join(' ');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const fcmToken = await getFcmToken();

      let response: any;
      if (isGuestUser) {
        response = await convertGuestToEmail(email, password);
      } else {
        // Split name into first and last name
        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] || name.trim();
        // If there's a last name, use it; otherwise use the first name as last name
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

        response = await register({
          email,
          purpose,
          password,
          firstName,
          lastName,
          signUpType: 'manual',
          fcmToken,
        });
      }

      const user = response?.user;
      const token = response?.tokens?.access;

      if (token) {
        dispatch(fetchAllExercises());
        dispatch(fetchAllGuidedVoice());
        dispatch(fetchAllGuidedVoiceSettings());
        dispatch(fetchNightMode());
        dispatch(fetchFirstMoodWithFrequency());
      }
      if (isGuestUser && purpose && user?.email) {
        try {
          await setPurposeAPI({email: user.email, purpose});
        } catch (purposeError) {
          console.warn(
            'Failed to set purpose for guest conversion',
            purposeError,
          );
        }
      }

      dispatch(setToken(token));
      dispatch(setUser(user));

      reset(routes.HOME);
    } catch (error: any) {
      if (error?.data?.message) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardContainer>
      <View style={styles.container}>
        <BackHeader showBackBtn />
        <AuthContainer
          description="Find calm and clarity anytime, anywhere you need"
          error={`${errorMessage}`}
          handlePress={handleSignUp}
          loading={loading}
          buttonText="Sign up"
          showFooterBtn>
          <CustomTextInput
            Icon={SvgProfile}
            value={name}
            onChangeText={setName}
            placeholder="First Name"
          />
          <CustomTextInput
            Icon={SvgMail}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
          <CustomTextInput
            Icon={SvgLock}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize="none"
          />
        </AuthContainer>
      </View>
    </KeyboardContainer>
  );
};

export default SignUpEmail;
