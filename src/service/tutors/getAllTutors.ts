import axiosInstance from '../axiosInstance';

export const getAllTutors = async () => {
  try {
    const response = await axiosInstance.get('/tutors');
    return response.data;
  } catch (error) {
    throw error;
  }
};
