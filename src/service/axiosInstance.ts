import axios from 'axios';
import { store } from '../redux/store';
import { API_URL } from '../constants/constants';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  // ✅ 304 também é “sucesso” para GET com ETag
  validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
});

// Cache simples por URL (GET): ETag + último payload
const etagMap = new Map<string, string>();
const responseCache = new Map<string, any>();

const buildCacheKey = (config: any) => {
  // inclui URL + params para não colidir
  const url = config?.url || '';
  const params = config?.params ? JSON.stringify(config.params) : '';
  return `${url}|${params}`;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const tokenObj = store.getState().auth.token;
    if (tokenObj?.token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${tokenObj.token}`;
    }

    // If-None-Match para GET com ETag
    if ((config.method || 'get').toLowerCase() === 'get') {
      const key = buildCacheKey(config);
      const etag = etagMap.get(key);
      if (etag) {(config.headers as any)['If-None-Match'] = etag;}
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (res) => {
    const isGet = (res.config?.method || 'get').toLowerCase() === 'get';
    const key = buildCacheKey(res.config);
    if (isGet) {
      // guarda ETag + payload quando houver
      const etag = (res.headers as any)?.etag;
      if (etag) {etagMap.set(key, etag);}
      if (res.status !== 304) {
        responseCache.set(key, res.data);
      }
      // 304 resolvido aqui já cai como sucesso por causa do validateStatus
      if (res.status === 304) {
        const cached = responseCache.get(key);
        if (cached !== undefined) {
          return { ...res, data: cached };
        }
      }
    }
    return res;
  },
  (error) => {
    // fallback extra: se algum 304 cair aqui por adapter/proxy, devolve cache
    const status = error?.response?.status;
    if (status === 304) {
      const key = buildCacheKey(error?.config || error?.response?.config || {});
      const cached = responseCache.get(key);
      if (cached !== undefined) {
        return Promise.resolve({
          ...error.response,
          data: cached,
          status: 304,
        });
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
