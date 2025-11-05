import axiosInstance from '../axiosInstance';

export const getBedtimeReminder = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/bedtime-reminder/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
