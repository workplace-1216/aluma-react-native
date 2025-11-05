import axiosInstance from '../axiosInstance';

export const updateBedtimeReminder = async (body: any) => {
  console.log('body', body);
  try {
    const response = await axiosInstance.post('/bedtime-reminder', body);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
