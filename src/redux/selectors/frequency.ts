import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const selectCurrentFrequency = createSelector(
  (state: RootState) => state.frequencyQueue.queue,
  (state: RootState) => state.frequencyQueue.currentIndex,
  (state: RootState) => state.nightMode.isNightMode,
  (state: RootState) => state.nightMode.frequency,
  (queue, currentIndex, isNightMode, nightFrequencies) => {
    if (isNightMode) {
      return nightFrequencies?.[0];
    }
    return queue?.[currentIndex];
  },
);
