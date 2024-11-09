import { InjectionToken } from '@angular/core';

export enum LogLevel {
  DEBUG = 1,
  WARN = 2,
  ERROR = 3,
}

export interface EnvironmentConfig {
  logLevel: LogLevel;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ENV_CONFIG = new InjectionToken<EnvironmentConfig>('env.config');
