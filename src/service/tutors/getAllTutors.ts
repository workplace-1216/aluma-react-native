import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import {TutorResponse} from '../../utils/types';
import {setAllTutors} from '../../redux/slice/tutorSlice';

export const fetchAllGuidedVoiceSettings = createAsyncThunk(
  'voiceGuides/fetchAll',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const data: TutorResponse[] = await getAllTutors();

      const filteredData = data.filter(item => item._id !== null);
      dispatch(setAllTutors(filteredData));
      return filteredData;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || 'Failed to fetch Tutors data',
      );
    }
  },
);

export const getAllTutors = async () => {
  try {
    const response = await axiosInstance.get('/tutors');

    return response.data;
  } catch (error) {
    throw error;
  }
};
