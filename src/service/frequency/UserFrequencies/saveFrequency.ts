import axiosInstance from '../../axiosInstance';

export const saveFrequency = async (frequencyId: string, userId: string) => {
  try {
    const response = await axiosInstance.post('/user-frequency', {
      frequency_id: frequencyId,
      user_id: userId,
    });

    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
