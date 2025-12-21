import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BreathworkExercise } from '../../utils/types';

interface BreathExerciseState {
  allExercises: BreathworkExercise[];
  lastUpdated?: number; // epoch ms
}

const initialState: BreathExerciseState = {
  allExercises: [],
  lastUpdated: undefined,
};

const breathExerciseSlice = createSlice({
  name: 'breathExercises',
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<BreathworkExercise[]>) => {
      state.allExercises = action.payload;
      state.lastUpdated = Date.now();
    },
    addExercise: (state, action: PayloadAction<BreathworkExercise>) => {
      state.allExercises.push(action.payload);
      state.lastUpdated = Date.now();
    },
    clearExercises: (state) => {
      state.allExercises = [];
      state.lastUpdated = undefined;
    },
  },
});

export const { setExercises, addExercise, clearExercises } = breathExerciseSlice.actions;
export default breathExerciseSlice.reducer;
