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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private sessionTokens: SessionTokens | null = null;
  private currentUser: User | null = null;

  constructor(
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

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
    this.sessionTokens = null;
    this.currentUser = null;
  }

  private setupAutoRefresh(): void {
    if (!this.sessionTokens) return;

    const timeUntilExpiry = this.sessionTokens.accessTokenExpiresInSeconds * 1000 - Date.now() - 5000;

    timer(timeUntilExpiry)
      .pipe(
        switchMap(() => this.tokenService.refresh()),
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
