import {Image, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useEffect, useRef} from 'react';
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
import {BRAND_GRADIENT, BRAND_LOGO_SIZE} from '../../../theme/branding';
import {fetchTutorsOnce} from '../../../service/tutors/fetchTutorsOnce';
import {fetchGlobalFeaturesOnce} from '../../../service/global/fetchGlobalFeaturesOnce';

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
  const bootstrapStartedRef = useRef(false);
  const didNavigateRef = useRef(false);
  const tokenRef = useRef(token);
  const userRef = useRef(user);
  const exLastRef = useRef(exLast);
  const vgLastRef = useRef(vgLast);
  const nmLastRef = useRef(nmLast);
  const moodsLastRef = useRef(moodsLast);
  const frequencyLastRef = useRef(frequencyLast);
  const savedFreqLastRef = useRef(savedFreqLast);

  useEffect(() => {
    tokenRef.current = token;
    userRef.current = user;
    exLastRef.current = exLast;
    vgLastRef.current = vgLast;
    nmLastRef.current = nmLast;
    moodsLastRef.current = moodsLast;
    frequencyLastRef.current = frequencyLast;
    savedFreqLastRef.current = savedFreqLast;
  }, [
    token,
    user,
    exLast,
    vgLast,
    nmLast,
    moodsLast,
    frequencyLast,
    savedFreqLast,
  ]);

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
    if (bootstrapStartedRef.current) {
      console.log('[BOOT][SPLASH] bootstrap already started, skipping');
      return;
    }
    bootstrapStartedRef.current = true;
    let isMounted = true;
    const tokenSnapshot = tokenRef.current;
    const targetRoute = tokenSnapshot ? routes.HOME : routes.CONNECT;
    const startedAt = Date.now();
    console.log(
      `[BOOT][SPLASH] bootstrap start (token=${!!tokenSnapshot}) → target=${targetRoute}`,
    );

    const bootstrap = async () => {
      const tasks: Promise<any>[] = [];
      fetchTutorsOnce(dispatch).catch(error => {
        console.log('[BOOT][SPLASH] prefetch tutors failed', error);
      });
      fetchGlobalFeaturesOnce(dispatch).catch(error => {
        console.log(
          '[BOOT][SPLASH] prefetch global features failed',
          error,
        );
      });

      if (tokenSnapshot) {
        getFcmToken();
      }

      if (tokenSnapshot && needsRefresh(exLastRef.current)) {
        tasks.push(
          dispatch(fetchAllExercises()).catch(error => {
            console.log('[BOOT][SPLASH] fetchAllExercises failed', error);
          }),
        );
      }

      if (tokenSnapshot && needsRefresh(vgLastRef.current)) {
        tasks.push(
          dispatch(fetchAllGuidedVoice()).catch(error => {
            console.log('[BOOT][SPLASH] fetchAllGuidedVoice failed', error);
          }),
        );
      }

      if (tokenSnapshot && needsRefresh(nmLastRef.current)) {
        tasks.push(
          dispatch(fetchNightMode()).catch(error => {
            console.log('[BOOT][SPLASH] fetchNightMode failed', error);
          }),
        );
      }

      if (needsRefresh(moodsLastRef.current)) {
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

      if (needsRefresh(frequencyLastRef.current)) {
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

      const currentUser = userRef.current;
      if (tokenSnapshot && currentUser?._id && needsRefresh(savedFreqLastRef.current)) {
        tasks.push(
          (async () => {
            try {
              const data = await getSavedFrequencies(currentUser._id);
              dispatch(setSavedFrequencies(data ?? []));
            } catch (error) {
              console.error('Failed to preload saved frequencies:', error);
            }
          })(),
        );
      }

      const timeoutMs = 8000;
      const tasksPromise = Promise.all(tasks);
      const timeoutPromise = new Promise(resolve =>
        setTimeout(() => resolve('timeout'), timeoutMs),
      );

      let timedOut = false;
      const winner = await Promise.race([tasksPromise, timeoutPromise]);
      if (winner === 'timeout') {
        console.log(
          `[BOOT][SPLASH] bootstrap timed out after ${timeoutMs}ms, continuing`,
        );
        timedOut = true;
      }
      if (!timedOut) {
        try {
          await tasksPromise;
        } catch (err) {
          console.log('[BOOT][SPLASH] Some bootstrap tasks failed', err);
        }
      } else {
        tasksPromise.catch(err =>
          console.log('[BOOT][SPLASH] Async bootstrap task failed', err),
        );
      }

      if (isMounted) {
        console.log(
          `[BOOT][SPLASH] bootstrap end (${Date.now() - startedAt}ms) → reset(${targetRoute})`,
        );
        if (didNavigateRef.current) {
          console.log('[BOOT][SPLASH] reset skipped (already navigated)');
        } else {
          didNavigateRef.current = true;
          reset(targetRoute);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <LinearGradient
      colors={BRAND_GRADIENT as string[]}
      style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={images.Logo}
              style={{...styles.logo, ...BRAND_LOGO_SIZE}}
            />
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
