import axiosInstance from '../axiosInstance';

type TokenPayload = {
  token: string;
  expires: string;
};

type ConvertResponse = {
  user: any;
  tokens: {
    access: TokenPayload;
    refresh?: TokenPayload;
  };
};

export async function convertGuestToEmail(email: string, password: string) {
  const {data} = await axiosInstance.post('/auth/convert-guest', {
    type: 'email',
    email,
    password,
  });

  return data as ConvertResponse;
}

export async function convertGuestToGoogle(googleToken: string) {
  const {data} = await axiosInstance.post('/auth/convert-guest', {
    type: 'google',
    googleToken,
  });

  return data as ConvertResponse;
}

export async function convertGuestToApple(appleToken: string) {
  const {data} = await axiosInstance.post('/auth/convert-guest', {
    type: 'apple',
    appleToken,
  });

  return data as ConvertResponse;
}
