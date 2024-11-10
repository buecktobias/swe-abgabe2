import { InjectionToken } from '@angular/core';

export enum LogLevel {
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface EnvironmentConfig {
  logLevel: LogLevel;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ENV_CONFIG = new InjectionToken<EnvironmentConfig>('env.config');
