import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TutorResponse } from '../../utils/types';

export type TutorStatus = 'idle' | 'loading' | 'success' | 'error';

interface TutorState {
  allTutors: TutorResponse[];
  selectedTutor: TutorResponse | null;
  status: TutorStatus;
  error: string | null;
  lastFetchedAt: number | null;
}

const initialState: TutorState = {
  allTutors: [],
  selectedTutor: null,
  status: 'idle',
  error: null,
  lastFetchedAt: null,
};

const tutorSlice = createSlice({
  name: 'tutors',
  initialState,
  reducers: {
    setTutorsLoading: state => {
      state.status = 'loading';
      state.error = null;
    },
    setTutorsError: (state, action: PayloadAction<string | null>) => {
      state.status = 'error';
      state.error = action.payload;
    },
    setAllTutors: (state, action: PayloadAction<TutorResponse[]>) => {
      const newTutors = action.payload;
      state.allTutors = newTutors;
      state.status = 'success';
      state.error = null;
      state.lastFetchedAt = Date.now();

      if (newTutors.length === 0) {
        state.selectedTutor = null;
        return;
      }

      if (state.selectedTutor) {
        const stillExists = newTutors.find(
          t => t._id === state.selectedTutor!._id,
        );
        if (!stillExists) {
          state.selectedTutor = newTutors[0];
        }
      } else {
        state.selectedTutor = newTutors[0];
      }
    },
    setSelectedTutor: (state, action: PayloadAction<TutorResponse>) => {
      state.selectedTutor = action.payload;
    },
    clearTutors: state => {
      state.allTutors = [];
      state.selectedTutor = null;
      state.status = 'idle';
      state.error = null;
      state.lastFetchedAt = null;
    },
  },
});

export const {
  setAllTutors,
  setSelectedTutor,
  clearTutors,
  setTutorsLoading,
  setTutorsError,
} = tutorSlice.actions;
export default tutorSlice.reducer;
