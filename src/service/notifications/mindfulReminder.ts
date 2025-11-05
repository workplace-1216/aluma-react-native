import axiosInstance from '../axiosInstance';

export const getMindfulReminder = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/mindful-reminder/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
