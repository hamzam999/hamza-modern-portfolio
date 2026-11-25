import type { StateStorage } from 'zustand/middleware';

export const STORAGE_KEY = 'aq:v1';

/** In-memory fallback used when localStorage is missing or throws (Safari private mode, embedded views). */
const memory = new Map<string, string>();

function ls(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/** Every access is wrapped in try/catch; failures fall back to memory for the rest of the session. */
export const safeStorage: StateStorage = {
  getItem(name) {
    try {
      const s = ls();
      if (s) return s.getItem(name) ?? memory.get(name) ?? null;
    } catch {
      /* fall through */
    }
    return memory.get(name) ?? null;
  },
  setItem(name, value) {
    memory.set(name, value);
    try {
      ls()?.setItem(name, value);
    } catch {
      /* quota or blocked: memory copy stays */
    }
  },
  removeItem(name) {
    memory.delete(name);
    try {
      ls()?.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

/** Test helper. */
export const __clearMemoryStorage = () => memory.clear();
