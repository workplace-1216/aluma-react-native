import axiosInstance from '../axiosInstance';

export const logout = async (token: string) => {
  try {
    const response = await axiosInstance.post('/auth/logout', {
      accessToken: token,
    });

    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
