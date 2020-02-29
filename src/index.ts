import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getHeaderCaseInsensitive } from './utils';
import { AxiosETAGOptions } from './types';
import { BaseCache } from './BaseCache';

function isCacheableMethod(config: AxiosRequestConfig) {
  return ~['GET', 'HEAD'].indexOf(config.method.toUpperCase());
}

export default function axiosETAGCache(config?: AxiosRequestConfig, initialOptions?: AxiosETAGOptions) {
  const options = initialOptions || {} as AxiosETAGOptions;
  if (!options.cache) {
    options.cache = new BaseCache();
  }

  const getUUIDByAxiosConfig = (config: AxiosRequestConfig) => config.url;

  const requestInterceptor = (config: AxiosRequestConfig) => {
    if (isCacheableMethod(config)) {
      const uuid = getUUIDByAxiosConfig(config);
      const lastCachedResult = options.cache.get(uuid);
      if (lastCachedResult) {
        config.headers = { ...config.headers, 'If-None-Match': lastCachedResult.etag };
      }
    }
    return config;
  };

  const responseInterceptor = (response: AxiosResponse) => {
    if (isCacheableMethod(response.config)) {
      const responseETAG = getHeaderCaseInsensitive('etag', response.headers);
      if (responseETAG) {
        options.cache.set(getUUIDByAxiosConfig(response.config), responseETAG, response.data);
      }
    }
    return response;
  };

  const responseErrorInterceptor = (error: AxiosError) => {
    if (error.response.status === 304) {
      const getCachedResult = options.cache.get(getUUIDByAxiosConfig(config));
      if (!getCachedResult) {
        return Promise.reject(error);
      }
      const newResponse = error.response;
      newResponse.status = 200;
      newResponse.data = getCachedResult.value;
      return Promise.resolve(newResponse);
    }
    return Promise.reject(error);
  };

  const instance = axios.create(config);
  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

  return instance;
}

