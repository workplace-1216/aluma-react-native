import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FREQUENCY} from './moodSlice';

interface SavedFrequencyState {
  savedFrequencies: FREQUENCY[];
  lastUpdated?: number;
}

const initialState: SavedFrequencyState = {
  savedFrequencies: [],
  lastUpdated: undefined,
};

const savedFrequenciesSlice = createSlice({
  name: 'savedFrequencies',
  initialState,
  reducers: {
    setSavedFrequencies: (state, action: PayloadAction<FREQUENCY[]>) => {
      state.savedFrequencies = action.payload;
      state.lastUpdated = Date.now();
    },
    addSavedFrequency: (state, action: PayloadAction<FREQUENCY>) => {
      state.savedFrequencies.push(action.payload);
      state.lastUpdated = Date.now();
    },
    removeSavedFrequency: (state, action: PayloadAction<string>) => {
      state.savedFrequencies = state.savedFrequencies.filter(
        f => f._id !== action.payload,
      );
      state.lastUpdated = Date.now();
    },
    clearSavedFrequencies: state => {
      state.savedFrequencies = [];
      state.lastUpdated = undefined;
    },
  },
});

export const {
  setSavedFrequencies,
  addSavedFrequency,
  removeSavedFrequency,
  clearSavedFrequencies,
} = savedFrequenciesSlice.actions;

export default savedFrequenciesSlice.reducer;
