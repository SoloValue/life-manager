import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import yaml from 'js-yaml';
import pkg from '../../../package.json';

import {
  ApiConfig,
  AppConfig,
  Config,
  DateRequestsConfig,
} from '../models/config.model';

const STORAGE_KEY = 'appConfig';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configSignal = signal<Config | null>(null);

  public config = this.configSignal.asReadonly();

  constructor(private http: HttpClient) {}

  public loadConfig(): Promise<Config> {
    return this.prepareConfig();
  }

  private async prepareConfig(): Promise<Config> {
    const defaults = await this.loadDefaults();

    const fullConfig: Config = {
      ...defaults,
      app: {
        name: pkg.name,
        version: pkg.version,
      },
    };

    const overrides = await this.readSavedConfig();
    if (overrides?.api) {
      fullConfig.api = { ...fullConfig.api, ...overrides.api };
    }
    if (overrides?.dateRequests) {
      fullConfig.dateRequests = {
        ...fullConfig.dateRequests,
        ...overrides.dateRequests,
      };
    }

    this.configSignal.set(fullConfig);
    return fullConfig;
  }

  private loadDefaults(): Promise<Omit<Config, 'app'>> {
    return firstValueFrom(this.http
      .get('assets/config/config.yaml', { responseType: 'text' })
      .pipe(map((yamlText) => yaml.load(yamlText) as Omit<Config, 'app'>)));
  }

  public updateApiConfig(baseUrl: string, timeout: number): void {
    this.configSignal.update((cfg) => {
      if (!cfg) return cfg;
      return { ...cfg, api: { ...cfg.api, baseUrl, timeout } };
    });
    this.persistConfig();
  }

  public updateDateRequestsConfig(defaultDurationMinutes: number): void {
    this.configSignal.update((cfg) => {
      if (!cfg) return cfg;
      return {
        ...cfg,
        dateRequests: { ...cfg.dateRequests, defaultDurationMinutes },
      };
    });
    this.persistConfig();
  }

  private persistConfig(): void {
    const cfg = this.configSignal();
    if (!cfg) return;
    const value = JSON.stringify({ api: cfg.api, dateRequests: cfg.dateRequests });
    if (Capacitor.isNativePlatform()) {
      void Preferences.set({ key: STORAGE_KEY, value }).catch((err) =>
        console.error('[ConfigService]: Failed to persist config', err),
      );
    } else {
      localStorage.setItem(STORAGE_KEY, value);
    }
  }

  private async readSavedConfig(): Promise<Partial<Config> | null> {
    if (Capacitor.isNativePlatform()) {
      try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        return this.parseSavedConfig(value);
      } catch (err) {
        console.error('[ConfigService]: Failed to read saved config', err);
        return null;
      }
    }
    return this.parseSavedConfig(localStorage.getItem(STORAGE_KEY));
  }

  private parseSavedConfig(value: string | null): Partial<Config> | null {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value) as Partial<Config>;
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (err) {
      console.error('[ConfigService]: Invalid saved config, using defaults', err);
    }
    return null;
  }

  public getApiBaseUrl(): string {
    return this.configSignal()?.api.baseUrl ?? 'http://127.0.0.1:8000';
  }

  public getApiTimeout(): number {
    return this.configSignal()?.api.timeout ?? 30000;
  }

  public getAppName(): string {
    return this.configSignal()?.app.name ?? '2gether';
  }

  public getDefaultDurationMinutes(): number {
    return this.configSignal()?.dateRequests.defaultDurationMinutes ?? 60;
  }
}
