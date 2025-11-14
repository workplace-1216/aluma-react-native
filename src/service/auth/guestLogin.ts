import axiosInstance from '../axiosInstance';

type TokenPayload = {
  token: string;
  expires: string;
};

type GuestAuthResponse = {
  user: any;
  tokens: {
    access: TokenPayload;
    refresh?: TokenPayload;
  };
};

export async function guestLogin(params: {
  deviceId?: string;
  fcmToken?: string;
}): Promise<GuestAuthResponse> {
  const {data} = await axiosInstance.post('/auth/guest', params);
  return data as GuestAuthResponse;
}

export async function attachFcmToken(fcmToken: string) {
  const {data} = await axiosInstance.post('/me/fcm', {fcmToken});
  return data as {ok: boolean};
}
