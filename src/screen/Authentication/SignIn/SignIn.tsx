import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import Container from '../../../components/layout/Container';
import CustomButton from '../../../components/UI/CustomButton/CustomButton';
import {navigate, reset} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import signUpWithGoogle from '../../../service/auth/googleSignUp';
import {setToken} from '../../../redux/slice/authSlice';
import {setUser} from '../../../redux/slice/userSlice';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {googleKey} from '../../../constants/constants';
import {fetchAllGuidedVoiceSettings} from '../../../service/tutors/getAllTutors';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import signUpWithApple from '../../../service/auth/appleSignUp';
import {fetchFirstMoodWithFrequency} from '../../../service/mood/getFirstMood';
import {
  convertGuestToApple,
  convertGuestToGoogle,
} from '../../../service/auth/convertGuest';

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [appleLoader, setAppleLoader] = useState(false);
  const [error, setError] = useState<string | null>('');

  const isGuestUser = useMemo(
    () => currentUser?.provider === 'guest' || currentUser?.isAnonymous,
    [currentUser._id, currentUser.isAnonymous, currentUser.provider],
  );

  GoogleSignin.configure({
    webClientId: googleKey,
  });

  const navigateSignInEmail = () => {
    navigate(routes.SIGN_IN_EMAIL);
  };

  const handleSignUpWithGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      let response: any;

      if (isGuestUser) {
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
        const signInResult = await GoogleSignin.signIn();
        let idToken = signInResult.data?.idToken;
        if (!idToken) {
          idToken = signInResult?.idToken;
        }
        if (!idToken) {
          throw new Error('No ID token found');
        }
        response = await convertGuestToGoogle(idToken);
      } else {
        response = await signUpWithGoogle();
      }

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

      dispatch(fetchAllGuidedVoiceSettings());
      dispatch(fetchFirstMoodWithFrequency());
      dispatch(setToken(token));
      dispatch(
        setUser({...user, lastName: user.lastName || '', googleAccount: true}),
      );

      if (!user.purpose) {
        navigate(routes.SIGN_UP_PURPOSE, {
          signUpType: 'google',
          user: response,
        });
      } else {
        showToast('Logged In Successfully!');
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

      const email = user.email;
      const name = user.fullName?.givenName || '';
      const socialId = user.user;
      const loginWith = 'apple';

      console.log('Apple Sign-In Success → User =>', {
        user,
      });

      const identityToken = user.identityToken;
      if (!identityToken) {
        throw new Error('Missing identity token from Apple');
      }

      const response = isGuestUser
        ? await convertGuestToApple(identityToken)
        : await signUpWithApple({
            email,
            firstName: name,
            lastName: user.fullName?.familyName ?? 'User',
            socialId,
            idToken: identityToken,
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
      dispatch(fetchAllGuidedVoiceSettings());
      dispatch(fetchFirstMoodWithFrequency());
      dispatch(setUser(userData));
      dispatch(setToken(token));
      reset(routes.HOME);
      console.log('Apple Sign-In Success →', {
        name,
        email,
        socialId,
        loginWith,
      });
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
          showFooterBtn
          buttonText="Use your email"
          loading={loading}
          error={`${error}`}
          handlePress={navigateSignInEmail}
          description="Log in your account or link it to a pre-existing one">
          <CustomButton
            title={loading ? 'Loading...' : 'Continue with Google'}
            variant={'outline'}
            onPress={handleSignUpWithGoogle}
            disabled={loading}
          />

          <CustomButton
            title={appleLoader ? 'Loading...' : 'Continue with Apple'}
            variant={'outline'}
            onPress={handleAppleLogin}
            disabled={appleLoader}
          />
        </AuthContainer>
      </View>
    </Container>
  );
};

export default SignIn;
