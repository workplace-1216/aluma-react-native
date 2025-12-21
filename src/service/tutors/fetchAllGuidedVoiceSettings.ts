import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch} from '../../redux/store';
import {fetchTutorsOnce} from './fetchTutorsOnce';

export const fetchAllGuidedVoiceSettings = createAsyncThunk<
  void,
  void,
  {dispatch: AppDispatch}
>(
  'voiceGuides/fetchAll',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      await fetchTutorsOnce(dispatch);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || 'Failed to fetch Tutors data',
      );
    }
  },
);
