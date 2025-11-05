import {UserState} from '../../redux/slice/userSlice';
import axiosInstance from '../axiosInstance';

export const updateUser = async (userId: string, data: Partial<UserState>) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
