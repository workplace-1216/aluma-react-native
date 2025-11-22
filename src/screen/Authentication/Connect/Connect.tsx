import React, {useCallback, useState} from 'react';
import {
  Text,
  View,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {styles} from './styles';
import CustomButton from '../../../components/UI/CustomButton/CustomButton';
import {navigate, reset} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
import Container from '../../../components/layout/Container';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';
import {webURL} from '../../../constants/constants';
import {useAppDispatch} from '../../../redux/store';
import {setToken} from '../../../redux/slice/authSlice';
import {setUser} from '../../../redux/slice/userSlice';
import {
  guestLogin,
  restoreGuestSession,
} from '../../../service/auth/guestLogin';
import createPersistentDeviceId from '../../../utils/createPersistentDeviceId';
import {getFcmToken} from '../../../utils/getFcmToken';
import {fetchAllExercises} from '../../../service/exercise/getAllExercise';
import {fetchAllGuidedVoice} from '../../../service/guide/gettAllGuideVoice';
import {fetchAllGuidedVoiceSettings} from '../../../service/tutors/getAllTutors';
import {fetchNightMode} from '../../../service/nightMode/getNightMode';
import {fetchFirstMoodWithFrequency} from '../../../service/mood/getFirstMood';
import {
  getStoredGuestDeviceId,
  persistGuestDeviceId,
} from '../../../utils/guestDeviceStorage';

// Reusable modal with WebView for legal pages
const LegalWebModal = ({
  visible,
  title,
  url,
  onClose,
}: {
  visible: boolean;
  title: string;
  url: string;
  onClose: () => void;
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}>
    <SafeAreaView style={{flex: 1}}>
      <Pressable onPress={onClose} style={{padding: 12}}>
        <Text style={{fontWeight: '600'}}>{'‹ Back'}</Text>
      </Pressable>
      <WebView source={{uri: url}} style={{flex: 1}} />
    </SafeAreaView>
  </Modal>
);

const Connect = () => {
  const dispatch = useAppDispatch();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const navigateLogin = () => navigate(routes.SIGN_IN);
  const navigateSignUp = () => navigate(routes.SIGN_UP);

  const toggleAccepted = () => setAccepted(prev => !prev);

  const bootstrapAfterAuth = useCallback(() => {
    dispatch(fetchAllExercises());
    dispatch(fetchAllGuidedVoice());
    dispatch(fetchAllGuidedVoiceSettings());
    dispatch(fetchNightMode());
    dispatch(fetchFirstMoodWithFrequency());
  }, [dispatch]);

  const loginGuestSession = useCallback(
    async (overrideGuestId?: string | null) => {
      const [storedGuestDeviceId, deviceId] = await Promise.all([
        overrideGuestId
          ? Promise.resolve(overrideGuestId)
          : getStoredGuestDeviceId(),
        createPersistentDeviceId(),
      ]);

      let fcmToken: string | undefined;
      try {
        const token = await getFcmToken();
        if (token && token !== 'dummyToken') {
          fcmToken = token;
        }
      } catch (error) {
        console.warn('Unable to get FCM token for guest login', error);
      }

      const response = await guestLogin({
        guestDeviceId: storedGuestDeviceId ?? undefined,
        deviceId,
        fcmToken,
      });

      const user = response?.user;
      const token = response?.tokens?.access;

      if (!user || !token) {
        throw new Error('Guest login failed');
      }

      if (user?.guestDeviceId) {
        await persistGuestDeviceId(user.guestDeviceId);
      }

      dispatch(setToken(token));
      dispatch(setUser(user));
      bootstrapAfterAuth();
      reset(routes.HOME);
    },
    [bootstrapAfterAuth, dispatch],
  );

  const handleGuestLogin = useCallback(async () => {
    if (!accepted) {
      Alert.alert(
        'Terms required',
        'Please accept the Terms of Use and Privacy Policy to continue.',
      );
      return;
    }

    try {
      setGuestLoading(true);
      await loginGuestSession();
    } catch (error: any) {
      console.error('Guest login error:', error);
      Alert.alert(
        'Unable to continue as guest',
        error?.data?.message || error?.message || 'Please try again.',
      );
    } finally {
      setGuestLoading(false);
    }
  }, [accepted, loginGuestSession]);

  const handleGuestRestore = useCallback(async () => {
    if (!accepted) {
      Alert.alert(
        'Terms required',
        'Please accept the Terms of Use and Privacy Policy to continue.',
      );
      return;
    }

    try {
      setRestoreLoading(true);
      const guestDeviceId = await getStoredGuestDeviceId();
      if (!guestDeviceId) {
        Alert.alert(
          'No guest session found',
          'We could not find any previous guest session on this device. Try exploring without signing up first.',
        );
        return;
      }

      const restoreResponse = await restoreGuestSession({guestDeviceId});

      if (!restoreResponse?.exists || !restoreResponse.user) {
        Alert.alert(
          'No purchases found',
          'We could not find any active subscription for this guest device.',
        );
        return;
      }

      const plan =
        restoreResponse.user?.subscription?.plan &&
        restoreResponse.user.subscription.plan !== 'free'
          ? restoreResponse.user.subscription.plan
          : null;

      Alert.alert(
        plan ? 'Subscription found' : 'Guest profile found',
        plan
          ? 'We found your previous subscription. Signing you back in...'
          : 'We found your guest profile. Continuing as guest.',
      );

      await loginGuestSession(guestDeviceId);
    } catch (error: any) {
      console.error('Guest restore error:', error);
      Alert.alert(
        'Unable to restore guest purchases',
        error?.data?.message || error?.message || 'Please try again.',
      );
    } finally {
      setRestoreLoading(false);
    }
  }, [accepted, loginGuestSession]);

  return (
    <Container>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <BackHeader />
        <AuthContainer description="A mindfulness space for your sleep, meditation and relaxation">
          {/* Consent row */}
          <Pressable
            onPress={toggleAccepted}
            accessibilityRole="checkbox"
            accessibilityState={{checked: accepted}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 20,
              marginBottom: 12,
            }}>
            {/* Checkbox box */}
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 2,
                backgroundColor: accepted ? 'white' : 'transparent',
              }}>
              {accepted ? <Text style={{fontWeight: '800'}}>{'✓'}</Text> : null}
            </View>

            {/* Label with links that open modals */}
            <Text
              style={{flex: 1, color: 'white', opacity: 0.9, lineHeight: 20}}>
              I have read and agree to the{' '}
              <Text
                style={{textDecorationLine: 'underline'}}
                onPress={e => {
                  e.stopPropagation();
                  setShowTerms(true);
                }}>
                Terms of Use (EULA)
              </Text>{' '}
              and{' '}
              <Text
                style={{textDecorationLine: 'underline'}}
                onPress={e => {
                  e.stopPropagation();
                  setShowPrivacy(true);
                }}>
                Privacy Policy
              </Text>
              .
            </Text>
          </Pressable>

          {/* Action buttons – only enabled when accepted */}
          <CustomButton
            title="Sign Up"
            variant="filled"
            onPress={accepted ? navigateSignUp : undefined}
            disabled={!accepted}
          />
          <View style={{marginTop: 10, width: '100%'}}>
            <CustomButton
              title="Log In"
              variant="outline"
              onPress={accepted ? navigateLogin : undefined}
              disabled={!accepted}
            />
          </View>

          <Pressable
            onPress={handleGuestLogin}
            disabled={!accepted || guestLoading}
            hitSlop={8}
            style={({pressed}) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center', // fica do tamanho do conteúdo (como um link)
                opacity: !accepted || guestLoading ? 0.6 : 1,
              },
              pressed && {opacity: 0.7},
            ]}
            accessibilityRole="button"
            accessibilityLabel="Explore without signing up">
            {/* Texto sublinhado (apenas o texto, não a linha inteira) */}
            <Text
              style={{
                color: '#fff',
                fontWeight: '600',
                textDecorationLine: 'underline',
                textDecorationColor: '#fff',
                textDecorationStyle: 'solid',
              }}>
              Explore without signing up
            </Text>

            {/* Círculo com o chevron em texto, nada de ícone */}
            <View
              style={{
                width: 18,
                height: 18,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 14, // número (metade de 28) — nunca '50%' em RN
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {guestLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '700',
                    // ajuda a centralizar melhor verticalmente
                    lineHeight: 16,
                    includeFontPadding: false,
                  }}>
                  {/* use '›' para parecer um chevron mais bonito que '>' */}›
                </Text>
              )}
            </View>
          </Pressable>

          {/* <Pressable
            onPress={handleGuestRestore}
            disabled={!accepted || guestLoading || restoreLoading}
            accessibilityRole="button"
            accessibilityLabel="Restore guest purchases"
            hitSlop={8}
            style={({pressed}) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 12,
                opacity:
                  !accepted || guestLoading || restoreLoading ? 0.6 : 1,
              },
              pressed && {opacity: 0.7},
            ]}>
            {restoreLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '600',
                  textDecorationLine: 'underline',
                }}>
                Restore purchases
              </Text>
            )}
          </Pressable> */}

          {/* (Optional) small helper text */}
          {!accepted && (
            <View style={{paddingHorizontal: 20}}>
              <Text
                style={{
                  textAlign: 'center',
                  opacity: 0.7,
                  color: 'white',
                  fontSize: 12,
                }}>
                Please accept the Terms of Use and Privacy Policy to continue.
              </Text>
            </View>
          )}
        </AuthContainer>

        {/* Modals */}
        <LegalWebModal
          visible={showPrivacy}
          title="Privacy Policy"
          url={`${webURL}privacy`}
          onClose={() => setShowPrivacy(false)}
        />
        <LegalWebModal
          visible={showTerms}
          title="Terms of Use (EULA)"
          url={`${webURL}terms`}
          onClose={() => setShowTerms(false)}
        />
      </SafeAreaView>
    </Container>
  );
};

export default Connect;
