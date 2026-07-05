import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import yaml from 'js-yaml';
import pkg from '../../../package.json';

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export interface AppConfig {
  name: string;
  version: string;
}

export interface DateRequestsConfig {
  defaultDurationMinutes: number;
}

export interface Config {
  api: ApiConfig;
  app: AppConfig;
  dateRequests: DateRequestsConfig;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configSignal = signal<Config | null>(null);

  public config = this.configSignal.asReadonly();

  constructor(private http: HttpClient) {}

  public loadConfig(): Observable<Config> {
    return this.http
      .get('assets/config/config.yaml', { responseType: 'text' })
      .pipe(
        map((yamlText) => {
          const config = yaml.load(yamlText) as Omit<Config, 'app'>;
          const fullConfig: Config = {
            ...config,
            app: {
              name: pkg.name,
              version: pkg.version,
            },
          };
          const saved = localStorage.getItem('appConfig');
          if (saved) {
            const parsed = JSON.parse(saved) as Partial<Config>;
            if (parsed.api) fullConfig.api = { ...fullConfig.api, ...parsed.api };
            if (parsed.dateRequests) fullConfig.dateRequests = { ...fullConfig.dateRequests, ...parsed.dateRequests };
          }
          this.configSignal.set(fullConfig);
          return fullConfig;
        }),
      );
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
      return { ...cfg, dateRequests: { ...cfg.dateRequests, defaultDurationMinutes } };
    });
    this.persistConfig();
  }

  private persistConfig(): void {
    const cfg = this.configSignal();
    if (cfg) {
      localStorage.setItem(
        'appConfig',
        JSON.stringify({ api: cfg.api, dateRequests: cfg.dateRequests }),
      );
    }
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
