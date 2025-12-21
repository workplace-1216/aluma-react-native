import axiosInstance from '../axiosInstance';

export const getAllGlobalData = async () => {
  try {
    const response = await axiosInstance.get('/global');

    return response.data;
  } catch (error) {
    throw error;
  }
};
