import { EnvironmentConfig, LogLevel } from './environment.config';
import { TimeDifference } from '../app/shared/models/time-difference.model';

export const environment: EnvironmentConfig = {
  logLevel: LogLevel.DEBUG, // eslint-disable-next-line no-magic-numbers
  accessTokenRefreshBufferTime: TimeDifference.inSeconds(5),
};
