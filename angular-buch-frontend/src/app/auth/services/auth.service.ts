import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { SessionTokens } from '../models/session-tokens.model';
import { User } from '../models/user.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';
import { LoginErrorType, LoginMeta } from '../models/login-result.model';
import { JwtService } from './jwt.service';
import { Logger } from '../../shared/services/logger.service';
import { TimeDifference } from '../../shared/models/time-difference.model';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // eslint-disable-next-line no-magic-numbers
  public readonly refreshBufferTime = TimeDifference.fromSeconds(5);
  private readonly refreshTokenStorageKey = 'refreshToken';
  private currentUser: User | null = null;

  constructor(
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {
    this.tryToRestoreSession();
  }

  get user(): User | null {
    return this.currentUser;
  }

  private _sessionTokens: SessionTokens | null = null;

  private get sessionTokens(): SessionTokens | null {
    return this._sessionTokens;
  }

  private get refreshToken(): string | null {
    if (this.sessionTokens) {
      this.logger.warn('Session tokens are already set, You should not call loadRefreshToken');
    }
    return localStorage.getItem(this.refreshTokenStorageKey);
  }

  public isLoggedIn(): boolean {
    return this.sessionTokens !== null;
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
  }

  private updateSessionTokens(newSessionTokens: SessionTokens | null) {
    if (newSessionTokens) {
      this._sessionTokens = newSessionTokens;
      const jwtPayload = this.jwtService.decode(newSessionTokens.accessToken);
      this.currentUser = User.fromJWTPayload(jwtPayload);
      localStorage.setItem(this.refreshTokenStorageKey, newSessionTokens.refreshToken);
      this.setupAutoRefresh();
    } else {
      this._sessionTokens = null;
      this.currentUser = null;
      localStorage.removeItem(this.refreshTokenStorageKey);
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
    return this.sessionTokens.accessTokenExpiresIn.ms - this.refreshBufferTime.ms;
  }

  private setupAutoRefresh(): void {
    if (!this.sessionTokens?.refreshToken) return;

    timer(this.calculateTimeUntilRefresh())
      .pipe(
        switchMap(() => {
          this.logger.debug('Auto Refreshing token');
          // @ts-expect-error sessionTokens is not null
          return this.tokenService.refresh(this.sessionTokens?.refreshToken);
        }),
        tap((newTokens) => {
          this.updateSessionTokens(newTokens);
        }),
      )
      .subscribe();
  }
}
