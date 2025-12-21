import {AppDispatch, store} from '../../redux/store';
import {getAllTutors} from './getAllTutors';
import {
  setAllTutors,
  setTutorsError,
  setTutorsLoading,
} from '../../redux/slice/tutorSlice';
import {TutorResponse} from '../../utils/types';

const TUTORS_TTL = 10 * 60 * 1000;
let inFlightPromise: Promise<TutorResponse[]> | null = null;

export const fetchTutorsOnce = (
  dispatch: AppDispatch,
  options?: {force?: boolean},
) => {
  const force = options?.force ?? false;

  if (inFlightPromise) {
    return inFlightPromise;
  }

  const state = store.getState().tutor;
  const now = Date.now();

  if (
    !force &&
    state.status === 'success' &&
    state.lastFetchedAt &&
    now - state.lastFetchedAt < TUTORS_TTL &&
    state.allTutors.length > 0
  ) {
    return Promise.resolve(state.allTutors);
  }

  const runFetch = async () => {
    dispatch(setTutorsLoading());
    try {
      const response = await getAllTutors();
      const data = Array.isArray(response) ? response : [];
      dispatch(setAllTutors(data));
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch tutors';
      dispatch(setTutorsError(message));
      throw error;
    } finally {
      inFlightPromise = null;
    }
  };

  inFlightPromise = runFetch();
  return inFlightPromise;
};
