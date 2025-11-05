import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TutorResponse {
  _id: string;
  name: string;
  bio: string;
  profile_picture: string;
}

interface TutorState {
  allTutors: TutorResponse[];
  selectedTutor: TutorResponse | null;
}

const initialState: TutorState = {
  allTutors: [],
  selectedTutor: null,
};

const tutorSlice = createSlice({
  name: 'tutors',
  initialState,
  reducers: {
    setAllTutors: (state, action: PayloadAction<TutorResponse[]>) => {
      const newTutors = action.payload;
      state.allTutors = newTutors;

      if (newTutors.length === 0) {
        state.selectedTutor = null;
        return;
      }

      if (state.selectedTutor) {
        const stillExists = newTutors.find(t => t._id === state.selectedTutor!._id);
        if (!stillExists) {
          state.selectedTutor = newTutors[0];
        }
      } else {
        state.selectedTutor = newTutors[0];
      }
    },
    setSelectedTutor: (state, action: PayloadAction<TutorResponse>) => {
      state.selectedTutor = action.payload;
    },
    clearTutors: (state) => {
      state.allTutors = [];
      state.selectedTutor = null;
    },
  },
});

export const { setAllTutors, setSelectedTutor, clearTutors } = tutorSlice.actions;
export default tutorSlice.reducer;
