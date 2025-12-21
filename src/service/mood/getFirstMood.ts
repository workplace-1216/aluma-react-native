import {setFrequencyQueue} from '../../redux/slice/frequencyQueueSlice';
import axiosInstance from '../axiosInstance';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const fetchFirstMoodWithFrequency = createAsyncThunk(
  'mood/fetchFirst',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const data = await getFirstMoodWithFrequency();
      dispatch(setFrequencyQueue([data.data.firstFrequency]));
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || 'Failed to fetch first mood data',
      );
    }
  },
);

export const getFirstMoodWithFrequency = async () => {
  try {
    const response = await axiosInstance.get('/moods/first');
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
