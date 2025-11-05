import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FREQUENCY } from './moodSlice';

interface FrequencyQueueState {
  queue: FREQUENCY[];
  currentIndex: number; // points to the currently active frequency
  isAllInOneMode: boolean; // indicates if we're in all-in-one listening mode
  frequencyDuration: number; // duration in seconds for each frequency in all-in-one mode
  moodWheelItemCurrentIndex: number;
}

const initialState: FrequencyQueueState = {
  queue: [],
  currentIndex: 0,
  isAllInOneMode: false,
  frequencyDuration: 0,
  moodWheelItemCurrentIndex: 0,
};

const frequencyQueueSlice = createSlice({
  name: 'frequencyQueue',
  initialState,
  reducers: {
    setFrequencyQueue: (state, action: PayloadAction<FREQUENCY[]>) => {
      state.queue = action.payload;
      state.currentIndex = 0;
      state.moodWheelItemCurrentIndex = 0;
    },
    addToFrequencyQueue: (state, action: PayloadAction<FREQUENCY>) => {
      state.queue.push(action.payload);
    },
    removeFromFrequencyQueue: (state, action: PayloadAction<number>) => {
      state.queue.splice(action.payload, 1);
      if (state.currentIndex >= state.queue.length) {
        state.currentIndex = Math.max(0, state.queue.length - 1);
      }
    },
    clearFrequencyQueue: (state) => {
      state.queue = [];
      state.currentIndex = 0;
      state.moodWheelItemCurrentIndex = 0;
    },
    popFrequencyQueue: (state) => {
      state.queue.shift();
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
      state.moodWheelItemCurrentIndex = 0;
    },
    setMoodWheelItemCurrentIndex: (state, action: PayloadAction<number>) => {
      state.moodWheelItemCurrentIndex = action.payload;
    },
    resetMoodWheelItemCurrentIndex: (state) => {
      state.moodWheelItemCurrentIndex = 0;
    },
    incrementCurrentIndex: (state) => {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
        state.moodWheelItemCurrentIndex = 0;
      }
    },
    resetCurrentIndex: (state) => {
      state.currentIndex = 0;
      state.moodWheelItemCurrentIndex = 0;
    },
    // New actions for All-in-One listening
    startAllInOneSession: (state, action: PayloadAction<{ frequencies: FREQUENCY[], durationPerFrequency: number }>) => {
      state.queue = action.payload.frequencies;
      state.currentIndex = 0;
      state.isAllInOneMode = true;
      state.frequencyDuration = action.payload.durationPerFrequency;
      state.moodWheelItemCurrentIndex = 0;
    },
    stopAllInOneSession: (state) => {
      state.isAllInOneMode = false;
      state.frequencyDuration = 0;
    },
    completeAllInOneSession: (state) => {
      state.isAllInOneMode = false;
      state.frequencyDuration = 0;
      state.queue = [];
      state.currentIndex = 0;
      state.moodWheelItemCurrentIndex = 0;
    },
  },
});

export const {
  setFrequencyQueue,
  addToFrequencyQueue,
  removeFromFrequencyQueue,
  clearFrequencyQueue,
  popFrequencyQueue,
  setCurrentIndex,
  incrementCurrentIndex,
  resetCurrentIndex,
  startAllInOneSession,
  stopAllInOneSession,
  completeAllInOneSession,
  setMoodWheelItemCurrentIndex,
  resetMoodWheelItemCurrentIndex,
} = frequencyQueueSlice.actions;

export default frequencyQueueSlice.reducer;
