import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import yaml from 'js-yaml';

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
    return new Observable<Config>((observer) => {
      this.http
        .get('assets/config/config.yaml', { responseType: 'text' })
        .subscribe({
          next: (yamlText) => {
            const config = yaml.load(yamlText as string) as Config;
            this.configSignal.set(config);
            observer.next(config);
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }

  public getApiBaseUrl(): string {
    return this.configSignal()?.api.baseUrl ?? 'http://127.0.0.1:8000';
  }

  public getApiTimeout(): number {
    return this.configSignal()?.api.timeout ?? 30000;
  }

  public getAppName(): string {
    return this.configSignal()?.app.name ?? 'Life Manager';
  }

  public getDefaultDurationMinutes(): number {
    return this.configSignal()?.dateRequests.defaultDurationMinutes ?? 60;
  }
}
