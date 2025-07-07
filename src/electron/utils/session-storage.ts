type StorageKeys = 'lastKnownRoute' | 'route-history';

const storage: Record<StorageKeys, unknown> = {
  lastKnownRoute: '',
  'route-history': ['/movies'],
};

const get = (key: StorageKeys) => {
  return storage?.[key];
};

const set = (key: StorageKeys, value: unknown) => {
  storage[key] = value;
};

export const sessionStorage = {
  get,
  set,
};
