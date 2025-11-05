import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FREQUENCY} from './moodSlice';

interface SavedFrequencyState {
  savedFrequencies: FREQUENCY[];
}

const initialState: SavedFrequencyState = {
  savedFrequencies: [],
};

const savedFrequenciesSlice = createSlice({
  name: 'savedFrequencies',
  initialState,
  reducers: {
    setSavedFrequencies: (state, action: PayloadAction<FREQUENCY[]>) => {
      state.savedFrequencies = action.payload;
    },
    addSavedFrequency: (state, action: PayloadAction<FREQUENCY>) => {
      state.savedFrequencies.push(action.payload);
    },
    removeSavedFrequency: (state, action: PayloadAction<string>) => {
      state.savedFrequencies = state.savedFrequencies.filter(
        f => f._id !== action.payload,
      );
    },
    clearSavedFrequencies: state => {
      state.savedFrequencies = [];
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
