import axiosInstance from '../../axiosInstance';

export const removeFrequency = async (frequencyId: string, userId: string) => {
  try {
    const response = await axiosInstance.put('/user-frequency', {
      frequency_id: frequencyId,
      user_id: userId,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
