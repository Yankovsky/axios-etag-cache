export interface CacheResponse {
  etag: string;
  value: any;
}

export interface CacheModule {
  reset: () => void;
  set: (uuid: string, etag: string, value: any) => void;
  get: (uuid: string) => CacheResponse;
}

export interface AxiosETAGOptions {
  cache: CacheModule;
}
