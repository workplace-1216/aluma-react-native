import axiosInstance from '../axiosInstance';

export const saveVideo = async (payload: {
  video_id: string;
  frequency_id?: string;
  title?: string;
  subtitle?: string;
  url: string;
  thumbnail?: string;
}) => {
  const response = await axiosInstance.post('/user-video', payload);
  return response.data; // { success, data }
};
