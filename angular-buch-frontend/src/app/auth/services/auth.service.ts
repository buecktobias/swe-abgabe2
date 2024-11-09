import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { SessionTokens } from '../models/session-tokens.model';
import { User } from '../models/user.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, of, timer } from 'rxjs';
import { LoginErrorType, LoginMeta } from '../models/login-result.model';
import { JwtService } from './jwt.service';
import { Logger } from '../../shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly refreshBufferSeconds = 5;
  private currentUser: User | null = null;

  constructor(
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {
    this.tryToRestoreSession();
  }

  private _sessionTokens: SessionTokens | null = null;

  set sessionTokens(value: SessionTokens | null) {
    this._sessionTokens = value;
    if (value) {
      localStorage.setItem('refreshToken', value.refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }

  get user(): User | null {
    return this.currentUser;
  }

  get isLoggedIn(): boolean {
    return this._sessionTokens !== null;
  }

  login(userLoginInformation: UserLoginInformation): Observable<LoginMeta> {
    return this.tokenService.login(userLoginInformation).pipe(
      map((result) => {
        if (result.meta.success && result.sessionTokens) {
          this.logger.debug('Login successful');
          this._sessionTokens = result.sessionTokens;
          this.setupAutoRefresh();
          const jwtPayload = this.jwtService.decode(result.sessionTokens.accessToken);
          this.currentUser = User.fromJWTPayload(jwtPayload);
        }
        return result.meta;
      }),
      catchError((error: Error) => {
        console.error('Login failed', error);
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
          this.setupAutoRefresh();
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
    return localStorage.getItem('refreshToken');
  }

  private setupAutoRefresh(): void {
    if (!this._sessionTokens?.refreshToken) return;

    const timeUntilRefreshInMs = (this._sessionTokens.accessTokenExpiresInSeconds - this.refreshBufferSeconds) * 1000;

    timer(timeUntilRefreshInMs)
      .pipe(
        switchMap(() => {
          this.logger.debug('Auto Refreshing token');
          // @ts-expect-error sessionTokens is not null
          return this.tokenService.refresh(this._sessionTokens.refreshToken);
        }),
        tap((newTokens) => {
          if (newTokens) {
            this._sessionTokens = newTokens;
            this.setupAutoRefresh();
          } else {
            this.logout();
          }
        }),
        catchError(() => {
          this.logout();
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
