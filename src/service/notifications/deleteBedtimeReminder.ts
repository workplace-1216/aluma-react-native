import axiosInstance from '../axiosInstance';

export const deleteBedtimeReminder = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/bedtime-reminder/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
