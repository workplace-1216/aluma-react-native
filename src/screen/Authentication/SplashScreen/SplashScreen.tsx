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
import {getMoodsAll} from '../../../service/mood/getMoodsAlll';
import {setMoods} from '../../../redux/slice/moodSlice';
import {setFrequencies} from '../../../redux/slice/frequencySlice';
import {getAllFrequencies} from '../../../service/frequency/getAllFrequencies';
import {needsRefresh} from '../../../utils/functions';

const SplashScreen = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token?.token);
  const user = useAppSelector(state => state.user);
  const playTime = useAppSelector(state => state.user.playingTime);

  // timestamps dos catálogos
  const exLast = useAppSelector(s => s.breathExercise.lastUpdated);
  const vgLast = useAppSelector(s => (s as any).voiceGuide.lastUpdated);
  const nmLast = useAppSelector(s => s.nightMode.lastUpdated);
  const moodsLast = useAppSelector(s => s.mood.lastUpdated);
  const frequencyLast = useAppSelector(s => s.frequency.lastUpdated);
  const savedFreqLast = useAppSelector(s => s.savedFrequencies.lastUpdated);

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
    let isMounted = true;
    const targetRoute = token ? routes.HOME : routes.CONNECT;

    const bootstrap = async () => {
      const tasks: Promise<any>[] = [];

      if (token) {
        getFcmToken();
      }

      // Set a timeout to navigate if tasks take too long
      const timer = setTimeout(() => {
        if (isMounted) {
          // Allow anonymous access - users can purchase without registration
          // Registration is optional and only needed for cross-device access
          reset(targetRoute);
        }
      }, 1200); // abre mais rápido

      if (token && needsRefresh(exLast)) {
        tasks.push(dispatch(fetchAllExercises()));
      }

      if (token && needsRefresh(vgLast)) {
        tasks.push(dispatch(fetchAllGuidedVoice()));
      }

      if (token && needsRefresh(nmLast)) {
        tasks.push(dispatch(fetchNightMode()));
      }

      if (needsRefresh(moodsLast)) {
        tasks.push(
          (async () => {
            try {
              const response = await getMoodsAll();
              dispatch(setMoods(response?.data ?? []));
            } catch (error) {
              console.error('Failed to preload moods:', error);
            }
          })(),
        );
      }

      if (needsRefresh(frequencyLast)) {
        tasks.push(
          (async () => {
            try {
              const response = await getAllFrequencies();
              dispatch(setFrequencies(response?.data ?? []));
            } catch (error) {
              console.error('Failed to preload frequencies:', error);
            }
          })(),
        );
      }

      if (token && user?._id && needsRefresh(savedFreqLast)) {
        tasks.push(
          (async () => {
            try {
              const data = await getSavedFrequencies(user._id);
              dispatch(setSavedFrequencies(data ?? []));
            } catch (error) {
              console.error('Failed to preload saved frequencies:', error);
            }
          })(),
        );
      }

      await Promise.all(tasks);

      // Clear the timer since we're navigating now
      clearTimeout(timer);

      if (isMounted) {
        reset(targetRoute);
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    token,
    dispatch,
    exLast,
    vgLast,
    nmLast,
    moodsLast,
    frequencyLast,
    savedFreqLast,
    user?._id,
  ]);

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
