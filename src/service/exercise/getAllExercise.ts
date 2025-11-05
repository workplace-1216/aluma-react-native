import { createAsyncThunk } from '@reduxjs/toolkit';
import { setExercises } from '../../redux/slice/breathExerciseSlice';
import { BreathworkExercise } from '../../utils/types';
import axiosInstance from '../axiosInstance';


export const fetchAllExercises = createAsyncThunk(
  'breathExercises/fetchAll',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data: BreathworkExercise[] = await getAllExercise();
      dispatch(setExercises(data));
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || 'Failed to fetch exercises');
    }
  }
);


export const getAllExercise = async () => {
  try {
    const response = await axiosInstance.get('/breath-exercise');

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
