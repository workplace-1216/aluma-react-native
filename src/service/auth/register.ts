import axiosInstance from '../axiosInstance';

export const register = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/register', data);

    return response.data;
  } catch (error: any) {
    console.error('Error:', error);
    throw error.response;
  }
};
