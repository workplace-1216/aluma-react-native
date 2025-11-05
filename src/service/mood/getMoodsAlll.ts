import axiosInstance from '../axiosInstance';

export const getMoodsAll = async () => {
  try {
    const response = await axiosInstance.get('/moods/all');

    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
