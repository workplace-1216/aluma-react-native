import axiosInstance from '../axiosInstance';

interface Payload {
  count: number;
  lastPlayingTimeDate: string;
}

export const setUserPlayingTime = async (payload: Payload) => {
  try {
    const response = await axiosInstance.post('/users/playing-time', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
