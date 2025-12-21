import axiosInstance from '../axiosInstance';

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axiosInstance.post('/auth/refresh-tokens', {
      refreshToken: refreshToken,
    });
    return response.data;
  } catch (error: any) {
    return error;
  }
};
