import axiosInstance from '../axiosInstance';

export const setDailyQuote = async (userId: string) => {
  try {
    const response = await axiosInstance.post(`/minful-reminder/${userId}`);
    console.log('response', response);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
