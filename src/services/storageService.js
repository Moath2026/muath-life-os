// ── Base Storage Service ──────────────────────────────────────────────────────
// Wraps localStorage with a consistent API.
// Replace the body of each method with API calls when migrating to a backend.

export class StorageService {
  constructor(key) {
    this.key = `dashboard_${key}`
  }

  _load(fallback = []) {
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  }

  _save(data) {
    try {
      localStorage.setItem(this.key, JSON.stringify(data))
      return true
    } catch {
      return false
    }
  }

  getAll(fallback = []) {
    return this._load(fallback)
  }

  getById(id, fallback = []) {
    return this._load(fallback).find(item => item.id === id) ?? null
  }

  create(item) {
    const all = this._load()
    const newItem = {
      ...item,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this._save([...all, newItem])
    return newItem
  }

  update(id, updates) {
    const all = this._load()
    const updated = all.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    )
    this._save(updated)
    return updated.find(i => i.id === id) ?? null
  }

  delete(id) {
    const all = this._load()
    this._save(all.filter(item => item.id !== id))
    return true
  }

  replace(data) {
    this._save(data)
  }
}
