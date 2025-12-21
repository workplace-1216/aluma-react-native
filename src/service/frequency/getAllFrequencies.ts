import axiosInstance from '../axiosInstance';

export const getAllFrequencies = async () => {
  try {
    const response = await axiosInstance.get('/frequency');

    return response.data;
  } catch (error) {
    throw error;
  }
};
