import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface MOODWHEEL {
  _id: string;
  frequency_id: string;
  created_at: string;
  updated_at: string;
  __v: number;
  quadrants: {
    _id: string;
    quadrant: number;
    title: string;
    description: string;
    audio_url: string;
  }[];
}

export interface FREQUENCY {
  _id: string;
  mood_id: string;
  frequency_value: number;
  title: string;
  description: string;
  detailed_information: string;
  background_image: string;
  background_image_night: string;
  photo_url: 'string';
  created_at: string;
  updated_at: string;
  default_audio_file: string;
  __v: number;
  moodWheelItems: MOODWHEEL[];
  detailed_information_type?: 'videos' | 'text' | string;
  videos?: FrequencyVideo[]; // <-- NOVO: origem dos cartões de vídeo
}

export interface MOOD {
  _id: string;
  name: string;
  description: string;
  icon_url: string;
  background_image: string;
  gradient: string[];
  created_at: string;
  updated_at: string;
  __v: number;
  frequencies: FREQUENCY[];
}

interface MoodState {
  allMoods: MOOD[];
  lastUpdated?: number;
}

const initialState: MoodState = {
  allMoods: [],
  lastUpdated: undefined,
};

export const moodSlice = createSlice({
  name: 'moods',
  initialState,
  reducers: {
    setMoods: (state, action: PayloadAction<MOOD[]>) => {
      state.allMoods = action.payload;
      state.lastUpdated = Date.now();
    },
    addMood: (state, action: PayloadAction<MOOD>) => {
      state.allMoods.push(action.payload);
      state.lastUpdated = Date.now();
    },
    clearMoods: state => {
      state.allMoods = [];
      state.lastUpdated = undefined;
    },
  },
});

export const {setMoods, addMood, clearMoods} = moodSlice.actions;
export default moodSlice.reducer;
