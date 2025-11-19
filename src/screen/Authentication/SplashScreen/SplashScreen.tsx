import {Image, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useEffect} from 'react';
import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../../assets/images';
import {SvgHeadphones} from '../../../assets/svg';
import routes from '../../../constants/routes';
import {reset} from '../../../navigation/AppNavigator';
import {getFcmToken} from '../../../utils/getFcmToken';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {fetchAllExercises} from '../../../service/exercise/getAllExercise';
import {fetchAllGuidedVoice} from '../../../service/guide/gettAllGuideVoice';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {fetchNightMode} from '../../../service/nightMode/getNightMode';
import {getSavedFrequencies} from '../../../service/frequency/UserFrequencies/getSavedFrequencies';
import {setSavedFrequencies} from '../../../redux/slice/savedFrequenciesSlice';
import {setUserPlayingTime} from '../../../service/users/setUserPlayingTime';
import {updatePlayingTime} from '../../../redux/slice/userSlice';

// TTL helper local (6 horas)
const TTL_6H = 6 * 60 * 60 * 1000;
const shouldRefresh = (lastUpdated?: number, ttlMs = TTL_6H) =>
  !lastUpdated || Date.now() - lastUpdated > ttlMs;

const SplashScreen = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token?.token);
  const user = useAppSelector(state => state.user);
  const playTime = useAppSelector(state => state.user.playingTime);

  // timestamps dos catálogos
  const exLast = useAppSelector(s => s.breathExercise.lastUpdated);
  const vgLast = useAppSelector(s => (s as any).voiceGuide.lastUpdated);
  const nmLast = useAppSelector(s => s.nightMode.lastUpdated); // adicionado no slice
  // (moods são carregados na tela Frequencies; se quiser, pode disparar aqui também)
  // const moodsLast = useAppSelector(s => s.mood.lastUpdated);

  // sync playing time diário
  useEffect(() => {
    if (!playTime) {return;}
    const today = new Date().toDateString();
    const payload = {
      count: playTime.lastPlayingTimeDate === today ? playTime.count : 0,
      lastPlayingTimeDate: today,
    };

    (async () => {
      try {
        await setUserPlayingTime(payload);
        dispatch(updatePlayingTime(payload));
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) {
      getFcmToken();

      // 🔄 Atualizações em background somente se TTL expirou
      if (shouldRefresh(exLast)) {dispatch(fetchAllExercises());}
      if (shouldRefresh(vgLast)) {dispatch(fetchAllGuidedVoice());}
      if (shouldRefresh(nmLast)) {dispatch(fetchNightMode());}
      // if (shouldRefresh(moodsLast)) dispatch(fetchMoodsThunk()); // se existir

      (async () => {
        try {
          const data = await getSavedFrequencies(user._id);
          dispatch(setSavedFrequencies(data));
        } catch {}
      })();
    }

    const timer = setTimeout(() => {
      // Allow anonymous access - users can purchase without registration
      // Registration is optional and only needed for cross-device access
      reset(token ? routes.HOME : routes.HOME);
    }, 1200); // abre mais rápido

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={['#1E2746', '#113D56', '#045466']}
      style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image source={images.Logo} style={styles.logo} />
          </View>
          <View style={styles.headphoneContainer}>
            <SvgHeadphones
              height={heightToDP('4.077%')}
              width={widthToDP('8.84%')}
            />
            <Text style={styles.bottomText}>
              Put on your headphones for the{'\n'}best experience
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SplashScreen;
