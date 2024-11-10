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

  get isLoggedIn(): boolean {
    return this.sessionTokens !== null;
  }

  private _sessionTokens: SessionTokens | null = null;

  private get sessionTokens(): SessionTokens | null {
    return this._sessionTokens;
  }

  private set sessionTokens(value: SessionTokens | null) {
    this._sessionTokens = value;
    if (value) {
      localStorage.setItem(this.refreshTokenStorageKey, value.refreshToken);
      this.setupAutoRefresh();
    } else {
      localStorage.removeItem(this.refreshTokenStorageKey);
    }
  }

  login(userLoginInformation: UserLoginInformation): Observable<LoginMeta> {
    return this.tokenService.login(userLoginInformation).pipe(
      map((result) => {
        if (result.meta.success && result.sessionTokens) {
          this.logger.debug('Login successful');
          this.sessionTokens = result.sessionTokens;
          const jwtPayload = this.jwtService.decode(result.sessionTokens.accessToken);
          this.currentUser = User.fromJWTPayload(jwtPayload);
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
    this._sessionTokens = null;
    this.currentUser = null;
  }

  private tryToRestoreSession(): void {
    this.logger.debug('Restoring session');
    const refreshToken = this.loadRefreshToken();
    if (!refreshToken) return;

    this.tokenService.refresh(refreshToken).subscribe({
      next: (newTokens) => {
        if (newTokens) {
          this._sessionTokens = newTokens;
          const jwtPayload = this.jwtService.decode(this._sessionTokens.accessToken);
          this.currentUser = User.fromJWTPayload(jwtPayload);
        } else {
          this.logout();
        }
      },
      error: () => {
        this.logout();
      },
    });
  }

  private loadRefreshToken(): string | null {
    if (this.sessionTokens) {
      this.logger.warn('Session tokens are already set, You should not call loadRefreshToken');
    }
    return localStorage.getItem(this.refreshTokenStorageKey);
  }

  private setupAutoRefresh(): void {
    if (!this.sessionTokens?.refreshToken) return;

    const timeUntilRefreshInMs = this.sessionTokens.accessTokenExpiresIn.subtract(this.refreshBufferTime).milliseconds;

    timer(timeUntilRefreshInMs)
      .pipe(
        switchMap(() => {
          this.logger.debug('Auto Refreshing token');
          // @ts-expect-error sessionTokens is not null
          return this.tokenService.refresh(this.sessionTokens.refreshToken);
        }),
        tap((newTokens) => {
          if (newTokens) {
            this.sessionTokens = newTokens;
          } else {
            this.logout();
          }
        }),
      )
      .subscribe();
  }
}
