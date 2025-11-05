import {AxiosResponse} from 'axios';
import {store} from '../redux/store';
import {reset} from '../navigation/AppNavigator';
import routes from '../constants/routes';
import {setRefreshToken, setToken} from '../redux/slice/authSlice';
import {refreshToken} from '../service/auth/refreshToken';
import {logout} from '../service/auth/logout';

export const request = async <T>(
  func: () => Promise<AxiosResponse<T>>,
  retryCount = 0,
  count = 0,
): Promise<AxiosResponse<T>> => {
  if (retryCount < 0) {
    throw new Error('Too many requests');
  }
  const dispatch = store.dispatch;
  try {
    const response = await func();

    return response as any as AxiosResponse;

  } catch (e: any) {
    if (e.response && e.response.status === 401) {
      const token = store.getState().auth.refreshToken;

      if (token) {
        // handle the refresh token gracefully, if it returns 401, send that back.
        const rtRes = await refreshToken(token);
        if (rtRes) {
          dispatch(setToken(rtRes.tokens.access.token));
          dispatch(setRefreshToken(rtRes.tokens.refresh.token));
        }
        if (!rtRes) {
          await logout(token);
          dispatch(setToken(''));
          dispatch(setRefreshToken(''));
          reset(routes.SIGN_IN);

          throw new Error(
            'Your session has expired, and can not be refreshed. Please login again.',
          );
        }

        if (count < retryCount + 2) {
          // Retry the original request after token refresh
          return request(func, retryCount, count + 1);
        }
      }
    }

    if (!e || !e.response || !e.response.status) {
      if (retryCount > 1) {
        return request(func, retryCount - 1, count + 1);
      }
    }
    throw e;
  }
};

export default request;
