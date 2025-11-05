import axiosInstance from '../axiosInstance';

export const login = async (data: {
  email: string;
  password: string;
  fcmToken: string;
}) => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    console.log('erro',error);
    throw error.response;
  }
};
