import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {needsRefresh} from '../utils/functions';
import {fetchAllExercises} from '../service/exercise/getAllExercise';
import {fetchAllGuidedVoice} from '../service/guide/gettAllGuideVoice';
import {fetchNightMode} from '../service/nightMode/getNightMode';
import {getMoodsAll} from '../service/mood/getMoodsAlll';
import {setMoods} from '../redux/slice/moodSlice';
import {getAllFrequencies} from '../service/frequency/getAllFrequencies';
import {setFrequencies} from '../redux/slice/frequencySlice';
import {getSavedFrequencies} from '../service/frequency/UserFrequencies/getSavedFrequencies';
import {setSavedFrequencies} from '../redux/slice/savedFrequenciesSlice';

const DEBOUNCE_MS = 60 * 1000; // avoid re-checking too frequently on quick app state flips

export const useCatalogRefreshOnForeground = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.auth.token?.token);
  const userId = useAppSelector(s => s.user._id);

  // lastUpdated markers
  const exLast = useAppSelector(s => s.breathExercise.lastUpdated);
  const vgLast = useAppSelector(s => (s as any).voiceGuide.lastUpdated);
  const nmLast = useAppSelector(s => s.nightMode.lastUpdated);
  const moodsLast = useAppSelector(s => s.mood.lastUpdated);
  const frequencyLast = useAppSelector(s => s.frequency.lastUpdated);
  const savedFreqLast = useAppSelector(s => s.savedFrequencies.lastUpdated);

  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    const handleAppStateChange = async (status: AppStateStatus) => {
      if (status !== 'active') {
        return;
      }

      const now = Date.now();
      if (now - lastCheckRef.current < DEBOUNCE_MS) {
        const secs = Math.round((now - lastCheckRef.current) / 1000);
        console.log(
          `[REFRESH][CATALOG] Skipping check; last run ${secs}s ago (debounce ${DEBOUNCE_MS}ms)`,
        );
        return;
      }
      lastCheckRef.current = now;
      console.log('[REFRESH][CATALOG] AppState active, checking TTLs');

      const tasks: Promise<any>[] = [];
      const toRefresh: string[] = [];

      if (token && needsRefresh(exLast)) {
        toRefresh.push('exercises');
        tasks.push(
          dispatch(fetchAllExercises()).catch(e =>
            console.log('[REFRESH][CATALOG] fetchAllExercises failed', e),
          ),
        );
      }

      if (token && needsRefresh(vgLast)) {
        toRefresh.push('voiceGuides');
        tasks.push(
          dispatch(fetchAllGuidedVoice()).catch(e =>
            console.log('[REFRESH][CATALOG] fetchAllGuidedVoice failed', e),
          ),
        );
      }

      if (token && needsRefresh(nmLast)) {
        toRefresh.push('nightMode');
        tasks.push(
          dispatch(fetchNightMode()).catch(e =>
            console.log('[REFRESH][CATALOG] fetchNightMode failed', e),
          ),
        );
      }

      if (needsRefresh(moodsLast)) {
        toRefresh.push('moods');
        tasks.push(
          (async () => {
            try {
              const response = await getMoodsAll();
              dispatch(setMoods(response?.data ?? []));
            } catch (e) {
              console.log('[REFRESH][CATALOG] getMoodsAll failed', e);
            }
          })(),
        );
      }

      if (needsRefresh(frequencyLast)) {
        toRefresh.push('frequencies');
        tasks.push(
          (async () => {
            try {
              const response = await getAllFrequencies();
              dispatch(setFrequencies(response?.data ?? []));
            } catch (e) {
              console.log('[REFRESH][CATALOG] getAllFrequencies failed', e);
            }
          })(),
        );
      }

      if (token && userId && needsRefresh(savedFreqLast)) {
        toRefresh.push('savedFrequencies');
        tasks.push(
          (async () => {
            try {
              const data = await getSavedFrequencies(userId);
              dispatch(setSavedFrequencies(data ?? []));
            } catch (e) {
              console.log('[REFRESH][CATALOG] getSavedFrequencies failed', e);
            }
          })(),
        );
      }

      if (!tasks.length) {
        console.log('[REFRESH][CATALOG] No refresh needed (all within TTL)');
        return;
      }

      console.log(
        `[REFRESH][CATALOG] Refreshing: ${toRefresh.join(', ') || 'none'}`,
      );

      try {
        await Promise.all(tasks);
        console.log('[REFRESH][CATALOG] Refresh complete');
      } catch (e) {
        console.log('[REFRESH][CATALOG] Refresh completed with errors', e);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [
    dispatch,
    token,
    userId,
    exLast,
    vgLast,
    nmLast,
    moodsLast,
    frequencyLast,
    savedFreqLast,
  ]);
};
