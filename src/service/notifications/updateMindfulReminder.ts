import axiosInstance from '../axiosInstance';

export const updateMindfulReminder = async (body: any) => {
  console.log('body', body);
  try {
    const response = await axiosInstance.post('/mindful-reminder', body);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
