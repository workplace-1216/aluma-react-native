import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VoiceGuide } from '../../utils/types';

interface VoiceGuideState {
  allVoiceGuides: VoiceGuide[];
  lastUpdated?: number;
}

const initialState: VoiceGuideState = {
  allVoiceGuides: [],
  lastUpdated: undefined,
};

const voiceGuideSlice = createSlice({
  name: 'voiceGuide',
  initialState,
  reducers: {
    setVoiceGuides: (state, action: PayloadAction<VoiceGuide[]>) => {
      // mantém só os que têm tutor_id válido
      state.allVoiceGuides = action.payload.filter(v => v.tutor_id !== null);
      state.lastUpdated = Date.now();
    },
    addVoiceGuide: (state, action: PayloadAction<VoiceGuide>) => {
      if (action.payload.tutor_id !== null) {
        state.allVoiceGuides.push(action.payload);
        state.lastUpdated = Date.now();
      }
    },
    clearVoiceGuides: (state) => {
      state.allVoiceGuides = [];
      state.lastUpdated = undefined;
    },
  },
});

export const { setVoiceGuides, addVoiceGuide, clearVoiceGuides } = voiceGuideSlice.actions;
export default voiceGuideSlice.reducer;
