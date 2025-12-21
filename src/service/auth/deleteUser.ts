import axiosInstance from '../axiosInstance';

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);

    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
