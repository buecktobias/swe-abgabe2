import { Inject, Injectable } from '@angular/core';
import { ENV_CONFIG, EnvironmentConfig, LogLevel } from '../../../environments/environment.config';

@Injectable({
  providedIn: 'root',
})
export class Logger {
  constructor(@Inject(ENV_CONFIG) private readonly config: EnvironmentConfig) {}

  debug(message: string, ...optionalParams: never[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(`DEBUG: ${message}`, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: never[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`WARN: ${message}`, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: never[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`ERROR: ${message}`, ...optionalParams);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.logLevel;
  }
}
