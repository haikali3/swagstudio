const CACHE_DURATION = 24 * 60 * 60 * 1000;

type CacheEntry = { data: any; expiry: number };
const mediaCache: Record<string, CacheEntry> = {};

export function getCache(key: string): any | null {
  const entry = mediaCache[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  return null;
}

export function setCache(key: string, data: any): void {
  mediaCache[key] = {
    data,
    expiry: Date.now() + CACHE_DURATION,
  };
}
