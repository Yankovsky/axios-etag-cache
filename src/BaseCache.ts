import { CacheModule, CacheResponse } from './types';

export class BaseCache implements CacheModule {
  cache: {};

  constructor() {
    this.cache = {};
  }

  get(uuid: string): CacheResponse | undefined {
    return this.cache[uuid];
  }

  set(uuid: string, etag: string, value: any) {
    this.cache[uuid] = { etag, value };
  }

  reset() {
    this.cache = {};
  }
}
