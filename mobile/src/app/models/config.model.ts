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
