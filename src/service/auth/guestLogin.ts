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

type GuestRestoreResponse = {
  exists: boolean;
  user?: any;
};

export async function guestLogin(params: {
  deviceId?: string;
  guestDeviceId?: string | null;
  fcmToken?: string;
}): Promise<GuestAuthResponse> {
  const {data} = await axiosInstance.post('/auth/guest', params);
  return data as GuestAuthResponse;
}

export async function restoreGuestSession(params: {
  guestDeviceId: string;
}): Promise<GuestRestoreResponse> {
  const {data} = await axiosInstance.post('/auth/guest/restore', params);
  return data as GuestRestoreResponse;
}

export async function attachFcmToken(fcmToken: string) {
  const {data} = await axiosInstance.post('/me/fcm', {fcmToken});
  return data as {ok: boolean};
}
