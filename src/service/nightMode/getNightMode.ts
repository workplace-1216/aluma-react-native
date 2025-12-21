import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import { setNightModeFrequency } from '../../redux/slice/nightModeSlice';
import { FREQUENCY } from '../../redux/slice/moodSlice';

export const fetchNightMode = createAsyncThunk(
  'night-mood/fetchAll',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const data: FREQUENCY[] = await getAllNightMode();

      // Only dispatch items with non-null tutor_id
      dispatch(setNightModeFrequency(data));
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || 'Failed to fetch guided voice data',
      );
    }
  },
);

export const getAllNightMode = async () => {
  try {
    const response = await axiosInstance.get('/night-mood');

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
