import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const STORAGE_NAMESPACE = 'life-manager';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private namespacedKey(key: string): string {
    return `${STORAGE_NAMESPACE}:${key}`;
  }

  public async get<T>(key: string): Promise<T | null> {
    const storageKey = this.namespacedKey(key);
    const value = Capacitor.isNativePlatform()
      ? await this.getNative(storageKey)
      : this.getWeb(storageKey);
    return this.parseValue<T>(value);
  }

  public async set<T>(key: string, value: T): Promise<void> {
    const storageKey = this.namespacedKey(key);
    const serialized = JSON.stringify(value);
    if (Capacitor.isNativePlatform()) {
      try {
        await Preferences.set({ key: storageKey, value: serialized });
      } catch (err) {
        console.error(`[StorageService]: Failed to write "${key}"`, err);
      }
    } else {
      localStorage.setItem(storageKey, serialized);
    }
  }

  public async remove(key: string): Promise<void> {
    const storageKey = this.namespacedKey(key);
    if (Capacitor.isNativePlatform()) {
      try {
        await Preferences.remove({ key: storageKey });
      } catch (err) {
        console.error(`[StorageService]: Failed to remove "${key}"`, err);
      }
    } else {
      localStorage.removeItem(storageKey);
    }
  }

  private async getNative(key: string): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value ?? null;
    } catch (err) {
      console.error(`[StorageService]: Failed to read "${key}"`, err);
      return null;
    }
  }

  private getWeb(key: string): string | null {
    return localStorage.getItem(key);
  }

  private parseValue<T>(value: string | null): T | null {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value) as T;
      if (parsed !== null && typeof parsed === 'object') return parsed;
      return parsed;
    } catch (err) {
      console.error(
        '[StorageService]: Invalid stored value, using default',
        err,
      );
      return null;
    }
  }
}
