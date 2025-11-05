import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import Container from '../../../components/layout/Container';
import CustomButton from '../../../components/UI/CustomButton/CustomButton';
import {navigate, reset} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
import signUpWithGoogle from '../../../service/auth/googleSignUp';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from '../../../redux/store';
import {setToken} from '../../../redux/slice/authSlice';
import {setUser} from '../../../redux/slice/userSlice';
import {googleKey} from '../../../constants/constants';
import {fetchAllGuidedVoiceSettings} from '../../../service/tutors/getAllTutors';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';
import {fetchAllExercises} from '../../../service/exercise/getAllExercise';
import {fetchAllGuidedVoice} from '../../../service/guide/gettAllGuideVoice';
import {fetchNightMode} from '../../../service/nightMode/getNightMode';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import signUpWithApple from '../../../service/auth/appleSignUp';
import {fetchFirstMoodWithFrequency} from '../../../service/mood/getFirstMood';

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [appleLoader, setAppleLoader] = useState(false);

  GoogleSignin.configure({
    webClientId: googleKey,
    iosClientId: googleKey,
  });

  const navigateSignUpPurpose = () => {
    navigate(routes.SIGN_UP_PURPOSE, {signUpType: 'email'});
  };

  const handleSignUpWithGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await signUpWithGoogle();

      const user = response?.user;
      const token = response?.tokens?.access;

      if (!user) {
        setError('Google sign-in failed');
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        setError('Something went wrong. Please try again.');
        return;
      }

      dispatch(fetchAllExercises());
      dispatch(fetchAllGuidedVoice());
      dispatch(fetchAllGuidedVoiceSettings());
      dispatch(fetchNightMode());
      dispatch(fetchFirstMoodWithFrequency());

      dispatch(setToken(token));
      dispatch(setUser({...user, googleAccount: true}));

      if (!user.purpose) {
        navigate(routes.SIGN_UP_PURPOSE, {
          signUpType: 'google',
          user: response,
        });
      } else {
        reset(routes.HOME);
      }
    } catch (err: any) {
      console.error('Google sign-up error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleAppleLogin = async () => {
    setAppleLoader(true);
    try {
      const user = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const email = user.email || '';
      const name = user.fullName?.givenName || '';
      const socialId = user.user;
      const loginWith = 'apple';

      const response = await signUpWithApple({
        email,
        firstName: name,
        lastName: user.fullName?.familyName ?? 'User',
        socialId,
        idToken: user.identityToken,
      });
      const userData = response?.user;
      const token = response?.tokens?.access;
      console.log('Apple Sign-In Success →', {
        name,
        email,
        socialId,
        loginWith,
      });
      if (!token) {
        setAppleLoader(false);
        setError('Something went wrong. Please try again.');
        return;
      }
      dispatch(fetchAllExercises());
      dispatch(fetchAllGuidedVoice());
      dispatch(fetchAllGuidedVoiceSettings());
      dispatch(fetchNightMode());
      dispatch(fetchFirstMoodWithFrequency());
      // }
      dispatch(setToken(token));
      dispatch(setUser(userData));
      reset(routes.HOME);
      setAppleLoader(false);
    } catch (error) {
      setAppleLoader(false);
      console.log('Apple Sign-In Error →', error);
    }
  };
  return (
    <Container>
      <View style={styles.container}>
        <BackHeader showBackBtn />
        <AuthContainer
          description="Create your account or link it to a pre-existing one"
          error={`${error}`}
          handlePress={navigateSignUpPurpose}
          loading={loading}
          buttonText="Use your email"
          showFooterBtn>
          <CustomButton
            title={loading ? 'Signing in...' : 'Continue with Google'}
            variant={'outline'}
            onPress={handleSignUpWithGoogle}
            disabled={loading}
          />

          <CustomButton
            title={appleLoader ? 'Signing in...' : 'Continue with Apple'}
            variant={'outline'}
            onPress={handleAppleLogin}
            disabled={appleLoader} // Disabled until implemented
          />
        </AuthContainer>
      </View>
    </Container>
  );
};

export default SignUp;
