import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import {setVoiceGuides} from '../../redux/slice/voiceGuideSlice';
import {VoiceGuide} from '../../utils/types';

export const fetchAllGuidedVoice = createAsyncThunk(
  'voiceGuides/fetchAll',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const data: VoiceGuide[] = await getAllGuidedVoice();

      // Only dispatch items with non-null tutor_id
      const filteredData = data.filter(item => item.tutor_id !== null);
      dispatch(setVoiceGuides(filteredData));
      return filteredData;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || 'Failed to fetch guided voice data',
      );
    }
  },
);

export const getAllGuidedVoice = async () => {
  try {
    const response = await axiosInstance.get('/guided-voice');

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
