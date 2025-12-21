import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VolumeState {
  volume: number;
}

const initialState: VolumeState = {
  volume: 1,
};

const volumeSlice = createSlice({
  name: 'volume',
  initialState,
  reducers: {
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
  },
});

export const { setVolume } = volumeSlice.actions;
export default volumeSlice.reducer;
