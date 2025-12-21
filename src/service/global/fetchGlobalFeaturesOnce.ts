import {Image} from 'react-native';
import {AppDispatch, store} from '../../redux/store';
import {getAllGlobalData} from './getGlobalData';
import {
  fetchGlobalFeaturesError,
  fetchGlobalFeaturesStart,
  fetchGlobalFeaturesSuccess,
} from '../../redux/slice/globalFeaturesSlice';
import {GlobalFeatures} from '../../types/globalFeatures';

const GLOBAL_FEATURES_TTL = 10 * 60 * 1000;

let inFlightPromise: Promise<GlobalFeatures> | null = null;

const prefetchThumbnails = (videos?: GlobalFeatures['weekly_tip_videos']) => {
  if (!Array.isArray(videos) || videos.length === 0) {
    return;
  }
  const limit = 4;
  videos.slice(0, limit).forEach(video => {
    const uri = video.cover_url || video.thumbnail;
    if (uri) {
      Image.prefetch(uri);
    }
  });
};

export const fetchGlobalFeaturesOnce = (
  dispatch: AppDispatch,
  options?: {force?: boolean},
) => {
  const force = options?.force ?? false;
  if (inFlightPromise) {
    return inFlightPromise;
  }

  const state = store.getState().globalFeatures;
  const now = Date.now();
  if (
    !force &&
    state.data &&
    state.lastFetchedAt &&
    now - state.lastFetchedAt < GLOBAL_FEATURES_TTL
  ) {
    return Promise.resolve(state.data);
  }

  const runFetch = async () => {
    dispatch(fetchGlobalFeaturesStart());
    try {
      const response = await getAllGlobalData();
      const data = (response?.data ?? response) as GlobalFeatures | undefined;
      if (!data) {
        throw new Error('Empty global features payload');
      }

      const fetchedAt = Date.now();
      dispatch(fetchGlobalFeaturesSuccess({data, fetchedAt}));
      prefetchThumbnails(data.weekly_tip_videos);
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load global features';
      dispatch(fetchGlobalFeaturesError(message));
      throw error;
    } finally {
      inFlightPromise = null;
    }
  };

  inFlightPromise = runFetch();
  return inFlightPromise;
};
