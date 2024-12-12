import { Inject, Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { SessionTokens } from '../models/session-tokens.model';
import { User } from '../models/user.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subscription, timer } from 'rxjs';
import { LoginErrorType, LoginMeta } from '../models/login-result.model';
import { Logger } from '../../shared/services/logger.service';
import { TimeDifference } from '../../shared/models/time-difference.model';
import { Role } from '../models/role.model';
import { JWTPayload } from '../models/jwt-payload.model';
import { jwtDecode } from 'jwt-decode';
import { ENV_CONFIG, EnvironmentConfig } from '../../../environments/environment.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly refreshBufferTime;
  private readonly refreshTokenStorageKey = 'refreshToken';
  private currentUser: User | null = null;
  private sessionTokens: SessionTokens | null = null;
  private autoRefreshSubscription: Subscription | null = null;

  constructor(
    private readonly tokenService: TokenService,
    private readonly logger: Logger,
    @Inject(ENV_CONFIG) private readonly environmentConfig: EnvironmentConfig,
  ) {
    this.tryToRestoreSession();
    // eslint-disable-next-line no-magic-numbers
    this.refreshBufferTime = environmentConfig.accessTokenRefreshBufferTime ?? TimeDifference.inSeconds(5);
  }

  get user(): User | null {
    return this.currentUser;
  }

  private get refreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenStorageKey);
  }

  public isLoggedIn(): boolean {
    return this.hasUserAccess();
  }

  public hasUserAccess(): boolean {
    return this.hasRole(Role.USER) || this.hasRole(Role.ADMIN);
  }

  public hasAdminAccess(): boolean {
    return this.hasRole(Role.ADMIN);
  }

  login(userLoginInformation: UserLoginInformation): Observable<LoginMeta> {
    return this.tokenService.login(userLoginInformation).pipe(
      map((result) => {
        if (result.meta.success && result.sessionTokens) {
          this.logger.debug('Login successful');
          this.updateSessionTokens(result.sessionTokens);
        }
        return result.meta;
      }),
      catchError((error: Error) => {
        this.logger.error('Login failed:' + error.message);
        return of({ success: false, errorType: LoginErrorType.UNKNOWN, message: error.message });
      }),
    );
  }

  logout(): void {
    this.logger.debug('Logging out');
    this.updateSessionTokens(null);
    this.stopAutoRefresh();
  }

  private updateSessionTokens(newSessionTokens: SessionTokens | null) {
    if (newSessionTokens) {
      this.sessionTokens = newSessionTokens;
      this.currentUser = User.fromJWTPayload(jwtDecode<JWTPayload>(newSessionTokens.accessToken));
      localStorage.setItem(this.refreshTokenStorageKey, newSessionTokens.refreshToken);
      this.setupAutoRefresh();
    } else {
      this.sessionTokens = null;
      this.currentUser = null;
      localStorage.removeItem(this.refreshTokenStorageKey);
      this.stopAutoRefresh();
    }
  }

  private hasRole(role: Role): boolean {
    return this.user?.roles.has(role) ?? false;
  }

  private tryToRestoreSession(): void {
    this.logger.debug('Restoring session');
    if (this.refreshToken) {
      this.tokenService.refresh(this.refreshToken).subscribe((newTokens) => {
        this.updateSessionTokens(newTokens);
      });
    }
  }

  private calculateTimeUntilRefresh(): number {
    if (!this.sessionTokens) {
      throw new TypeError('Session tokens are not set');
    }
    return this.sessionTokens.accessTokenExpiresIn.milliseconds - this.refreshBufferTime.milliseconds;
  }

  private setupAutoRefresh(): void {
    this.stopAutoRefresh();
    if (!this.sessionTokens?.refreshToken) return;

    this.autoRefreshSubscription = timer(this.calculateTimeUntilRefresh())
      .pipe(
        switchMap(() => {
          this.logger.debug('Auto Refreshing token');
          return this.tokenService.refresh(this.sessionTokens?.refreshToken ?? '');
        }),
        tap((newTokens) => {
          this.updateSessionTokens(newTokens);
        }),
      )
      .subscribe();
  }

  private stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
      this.logger.debug('Auto-refresh timer stopped');
    }
  }
}
