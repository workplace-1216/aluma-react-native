import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FREQUENCY } from './moodSlice';

interface FrequencyState {
  allFrequencies: FREQUENCY[];
  lastUpdated?: number;
}

const initialState: FrequencyState = {
  allFrequencies: [],
  lastUpdated: undefined,
};

const frequencySlice = createSlice({
  name: 'frequencies',
  initialState,
  reducers: {
    setFrequencies: (state, action: PayloadAction<FREQUENCY[]>) => {
      state.allFrequencies = action.payload;
      state.lastUpdated = Date.now();
    },
    addFrequency: (state, action: PayloadAction<FREQUENCY>) => {
      state.allFrequencies.push(action.payload);
      state.lastUpdated = Date.now();
    },
    clearFrequencies: (state) => {
      state.allFrequencies = [];
      state.lastUpdated = undefined;
    },
  },
});

export const { setFrequencies, addFrequency, clearFrequencies } = frequencySlice.actions;
export default frequencySlice.reducer;
