import { useEffect, useState } from 'react';

/**
 * React hook that syncs state with localStorage using JSON.
 * Used across the dashboard so Muath's data is persisted between sessions.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to parse localStorage for', key, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Failed to write localStorage for', key, err);
    }
  }, [key, value]);

  return [value, setValue];
}
