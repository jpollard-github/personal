export type StorageLike = {
  getItem(key: string): string | null;
  removeItem(key: string): void;
};

export function consumeSessionDraft<T>(storage: StorageLike, key: string) {
  const raw = storage.getItem(key);

  if (!raw) {
    return { value: null as T | null, hadValue: false, parseError: false };
  }

  try {
    return {
      value: JSON.parse(raw) as T,
      hadValue: true,
      parseError: false,
    };
  } catch {
    return {
      value: null as T | null,
      hadValue: true,
      parseError: true,
    };
  } finally {
    storage.removeItem(key);
  }
}
