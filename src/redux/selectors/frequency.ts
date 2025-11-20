import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const selectCurrentFrequency = createSelector(
  (state: RootState) => state.frequencyQueue.queue,
  (state: RootState) => state.frequencyQueue.currentIndex,
  (queue, currentIndex) => queue?.[currentIndex],
);
