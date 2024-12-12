import { InjectionToken } from '@angular/core';
import { TimeDifference } from '../app/shared/models/time-difference.model';

export enum LogLevel {
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface EnvironmentConfig {
  logLevel: LogLevel;
  accessTokenRefreshBufferTime?: TimeDifference;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ENV_CONFIG = new InjectionToken<EnvironmentConfig>('env.config');
