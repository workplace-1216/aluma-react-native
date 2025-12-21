import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  GlobalFeatures,
  GlobalFeaturesStatus,
} from '../../types/globalFeatures';

interface GlobalFeaturesState {
  data: GlobalFeatures | null;
  status: GlobalFeaturesStatus;
  lastFetchedAt: number | null;
  error: string | null;
}

const initialState: GlobalFeaturesState = {
  data: null,
  status: 'idle',
  lastFetchedAt: null,
  error: null,
};

const globalFeaturesSlice = createSlice({
  name: 'globalFeatures',
  initialState,
  reducers: {
    fetchGlobalFeaturesStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    fetchGlobalFeaturesSuccess(
      state,
      action: PayloadAction<{data: GlobalFeatures; fetchedAt: number}>,
    ) {
      state.data = action.payload.data;
      state.status = 'success';
      state.lastFetchedAt = action.payload.fetchedAt;
      state.error = null;
    },
    fetchGlobalFeaturesError(state, action: PayloadAction<string | null>) {
      state.status = 'error';
      state.error = action.payload;
    },
  },
});

export const {
  fetchGlobalFeaturesStart,
  fetchGlobalFeaturesSuccess,
  fetchGlobalFeaturesError,
} = globalFeaturesSlice.actions;

export default globalFeaturesSlice.reducer;
