import axiosInstance from '../axiosInstance';

export const forgotPassword = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
