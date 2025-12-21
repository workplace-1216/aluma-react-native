import axiosInstance from '../axiosInstance';

export const isPasswordAvailable = async () => {
  try {
    const response = await axiosInstance.get('/users/check-password-set');
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
