import axiosInstance from '../../axiosInstance';

export const getSavedFrequencies = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/user-frequency/${userId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
