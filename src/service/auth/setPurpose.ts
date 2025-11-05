import axiosInstance from '../axiosInstance';

export const setPurposeAPI = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/purpose', data);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
