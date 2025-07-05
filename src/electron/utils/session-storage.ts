type StorageKeys = 'lastKnownRoute';

const storage: Record<StorageKeys, unknown> = {
  lastKnownRoute: '/',
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
