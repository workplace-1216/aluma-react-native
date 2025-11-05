import axiosInstance from '../axiosInstance';

interface SetPasswordPayload {
  newPassword: string;
  oldPassword?: string; // optional now
}

export const setPassword = async (payload: SetPasswordPayload) => {
  try {
    const response = await axiosInstance.post(
      '/users/change-password',
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
