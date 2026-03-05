export const STORAGE_KEY = 'muath-life-dashboard-v1';

/**
 * Save the full application state to localStorage.
 */
export function saveData(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save dashboard data', err);
  }
}

/**
 * Load the full application state from localStorage.
 */
export function loadData() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse dashboard data', err);
    return null;
  }
}

/**
 * Export the current state as formatted JSON string.
 * Used for backup and manual export.
 */
export function backupData() {
  const data = loadData();
  if (!data) return '';
  return JSON.stringify(data, null, 2);
}

/**
 * Restore application state from a JSON string.
 * Returns the parsed object so the caller can patch React state.
 */
export function restoreData(json) {
  try {
    const parsed = JSON.parse(json);
    saveData(parsed);
    return parsed;
  } catch (err) {
    console.error('Failed to restore dashboard data from JSON', err);
    throw err;
  }
}

/**
 * Utility to get days remaining until a target date (YYYY-MM-DD).
 */
export function daysUntil(targetIsoDate) {
  const target = new Date(targetIsoDate);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Simple helper to format numbers as SAR currency.
 */
export function sar(amount) {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(amount);
}
