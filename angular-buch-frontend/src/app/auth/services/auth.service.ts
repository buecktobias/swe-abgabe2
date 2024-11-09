import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { SessionTokens } from '../models/session-tokens.model';
import { User } from '../models/user.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { Role } from '../models/role.model';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, of, timer } from 'rxjs';
import { LoginErrorType, LoginMeta } from '../models/login-result.model';
import { JwtService } from './jwt.service';
import { LoggerService } from '../../shared/services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly refreshBufferSeconds = 5;
  private sessionTokens: SessionTokens | null = null;
  private currentUser: User | null = null;

  constructor(
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {
    this.tryToRestoreSession();
  }

  get user(): User | null {
    return this.currentUser;
  }

  get isLoggedIn(): boolean {
    return this.sessionTokens !== null;
  }

  login(userLoginInformation: UserLoginInformation): Observable<LoginMeta> {
    return this.tokenService.login(userLoginInformation).pipe(
      map((result) => {
        if (result.meta.success && result.sessionTokens) {
          this.sessionTokens = result.sessionTokens;
          console.log('Login successful', this.sessionTokens);
          this.saveRefreshToken();
          this.setupAutoRefresh();
          const jwtPayload = this.jwtService.decode(this.sessionTokens.accessToken);
          this.currentUser = {
            username: jwtPayload.preferred_username,
            firstName: jwtPayload.given_name,
            lastName: jwtPayload.family_name,
            email: jwtPayload.email,
            roles: new Set(jwtPayload.resource_access['nest-client'].roles as Role[]),
          };
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
    this.loggerService.debug('Logging out');
    this.sessionTokens = null;
    this.currentUser = null;
    this.deleteRefreshToken();
  }

  private tryToRestoreSession(): void {
    this.loggerService.debug('Restoring session');
    const refreshToken = this.loadRefreshToken();
    if (!refreshToken) return;

    this.tokenService.refresh(refreshToken).subscribe({
      next: (newTokens) => {
        if (newTokens) {
          this.sessionTokens = newTokens;
          this.setupAutoRefresh();
          const jwtPayload = this.jwtService.decode(this.sessionTokens.accessToken);
          this.currentUser = {
            username: jwtPayload.preferred_username,
            firstName: jwtPayload.given_name,
            lastName: jwtPayload.family_name,
            email: jwtPayload.email,
            roles: new Set(jwtPayload.resource_access['nest-client'].roles as Role[]),
          };
        } else {
          this.logout();
        }
      },
      error: () => {
        this.logout();
      },
    });
  }

  private saveRefreshToken(): void {
    if (!this.sessionTokens) return;
    localStorage.setItem('refreshToken', this.sessionTokens.refreshToken);
  }

  private deleteRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }

  private loadRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setupAutoRefresh(): void {
    if (!this.sessionTokens?.refreshToken) return;

    const timeUntilRefreshInMs = (this.sessionTokens.accessTokenExpiresInSeconds - this.refreshBufferSeconds) * 1000;

    timer(timeUntilRefreshInMs)
      .pipe(
        switchMap(() => {
          this.loggerService.debug('Auto Refreshing token');
          // @ts-expect-error sessionTokens is not null
          return this.tokenService.refresh(this.sessionTokens.refreshToken);
        }),
        tap((newTokens) => {
          if (newTokens) {
            this.sessionTokens = newTokens;
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
