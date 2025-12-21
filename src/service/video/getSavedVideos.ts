import axiosInstance from '../axiosInstance';

export const getSavedVideos = async () => {
  const response = await axiosInstance.get('/user-video');
  return response.data;
};
