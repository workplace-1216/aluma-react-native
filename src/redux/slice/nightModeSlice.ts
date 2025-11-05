import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FREQUENCY } from './moodSlice';
import { resetMoodWheelItemCurrentIndex } from './frequencyQueueSlice';
import type { RootState, AppDispatch } from '../store';
import type { AnyAction, ThunkAction } from '@reduxjs/toolkit';

interface NightModeState {
  isNightMode: boolean;
  frequency: FREQUENCY[];
  lastUpdated?: number;
}

const initialState: NightModeState = {
  isNightMode: false,
  frequency: [],
  lastUpdated: undefined,
};

const nightModeSlice = createSlice({
  name: 'nightMode',
  initialState,
  reducers: {
    setNightMode: (state, action: PayloadAction<boolean>) => {
      state.isNightMode = action.payload;
    },
    toggleNightMode: (state) => {
      state.isNightMode = !state.isNightMode;
    },
    setNightModeFrequency: (state, action: PayloadAction<FREQUENCY[]>) => {
      state.frequency = action.payload;
      state.lastUpdated = Date.now();
    },
    clearNightModeFrequency: (state) => {
      state.frequency = [];
      state.lastUpdated = undefined;
    },
  },
});

export const {
  setNightMode,
  toggleNightMode,
  setNightModeFrequency,
  clearNightModeFrequency,
} = nightModeSlice.actions;

export const toggleNightAndLoad =
  ():
    ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch: AppDispatch, getState) => {
    dispatch(toggleNightMode());
    const {
      nightMode: { frequency },
    } = getState();
    if (frequency?.length) {
      dispatch(setNightModeFrequency(frequency));
    }
    dispatch(resetMoodWheelItemCurrentIndex());
  };

export default nightModeSlice.reducer;
