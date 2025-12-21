import axiosInstance from '../axiosInstance';

export const userSessions = async () => {
  try {
    const response = await axiosInstance.post('/users/track-session');

    return response.data;
  } catch (error) {
    throw error;
  }
};
