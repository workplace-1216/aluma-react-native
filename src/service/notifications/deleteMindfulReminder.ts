import axiosInstance from '../axiosInstance';

export const deleteMindfulReminder = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/mindful-reminder/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
