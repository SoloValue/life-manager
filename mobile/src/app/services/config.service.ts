import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import yaml from 'js-yaml';
import pkg from '../../../package.json';

import {
  ApiConfig,
  AppConfig,
  Config,
  DateRequestsConfig,
} from '../models/config.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'appConfig';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configSignal = signal<Config | null>(null);

  public config = this.configSignal.asReadonly();

  constructor(private http: HttpClient, private storage: StorageService) {}

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

    const overrides = await this.storage.get<Partial<Config>>(STORAGE_KEY);
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

  public updateApiAddress(baseUrl: string): void {
    this.configSignal.update((cfg) => {
      if (!cfg) return cfg;
      return { ...cfg, api: { ...cfg.api, baseUrl } };
    });
    this.persistConfig();
  }

  public updateApiTimeout(timeout: number): void {
    this.configSignal.update((cfg) => {
      if (!cfg) return cfg;
      return { ...cfg, api: { ...cfg.api, timeout } };
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
    void this.storage.set(STORAGE_KEY, {
      api: cfg.api,
      dateRequests: cfg.dateRequests,
    });
  }

  public getApiBaseUrl(): string {
    return this.configSignal()?.api.baseUrl ?? 'http://127.0.0.1:8000';
  }

  public getApiScheme(): string {
    return this.parseBaseUrl(this.getApiBaseUrl()).scheme;
  }

  public getApiHost(): string {
    return this.parseBaseUrl(this.getApiBaseUrl()).host;
  }

  public getApiPort(): string {
    return this.parseBaseUrl(this.getApiBaseUrl()).port;
  }

  private parseBaseUrl(baseUrl: string): { scheme: string; host: string; port: string } {
    try {
      const url = new URL(baseUrl);
      return {
        scheme: url.protocol.replace(':', ''),
        host: url.hostname,
        port: url.port,
      };
    } catch {
      return { scheme: 'http', host: baseUrl, port: '' };
    }
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
