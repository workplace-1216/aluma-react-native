import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SavedVideoItem {
  id: string;
  savedId?: string;
  url: string;
  title?: string;
  subtitle?: string;
  frequencyId?: string;
  frequencyTitle?: string;
  background?: string;
  savedAt?: number;
}

interface SavedVideosState {
  savedVideos: SavedVideoItem[];
  lastUpdated?: number;
}

const initialState: SavedVideosState = {
  savedVideos: [],
  lastUpdated: undefined,
};

const savedVideosSlice = createSlice({
  name: 'savedVideos',
  initialState,
  reducers: {
    setSavedVideos: (state, action: PayloadAction<SavedVideoItem[]>) => {
      state.savedVideos = action.payload;
      state.lastUpdated = Date.now();
    },
    addSavedVideo: (state, action: PayloadAction<SavedVideoItem>) => {
      const exists = state.savedVideos.some(
        video => video.id === action.payload.id,
      );
      if (exists) {return;}
      state.savedVideos.push({
        ...action.payload,
        savedAt: action.payload.savedAt ?? Date.now(),
      });
      state.lastUpdated = Date.now();
    },
    removeSavedVideo: (
      state,
      action: PayloadAction<{id: string} | {savedId: string}>,
    ) => {
      state.savedVideos = state.savedVideos.filter(video => {
        if ('savedId' in action.payload && action.payload.savedId) {
          return video.savedId !== action.payload.savedId;
        }
        return video.id !== (action as any).payload.id;
      });
      state.lastUpdated = Date.now();
    },
    clearSavedVideos: state => {
      state.savedVideos = [];
      state.lastUpdated = undefined;
    },
  },
});

export const {
  setSavedVideos,
  addSavedVideo,
  removeSavedVideo,
  clearSavedVideos,
} = savedVideosSlice.actions;
export default savedVideosSlice.reducer;
