import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { SessionTokens } from '../models/session-tokens.model';
import { User } from '../models/user.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { Role } from '../models/role.model';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
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

  login(userLoginInformation: UserLoginInformation): Observable<LoginMeta> {
    return this.tokenService.login(userLoginInformation).pipe(
      map((result) => {
        if (result.meta.success && result.sessionTokens) {
          this.sessionTokens = result.sessionTokens;
          const jwtPayload = this.jwtService.decode(this.sessionTokens.accessToken);
          this.currentUser = {
            username: jwtPayload.preferred_username,
            firstName: jwtPayload.given_name,
            lastName: jwtPayload.family_name,
            email: jwtPayload.email,
            roles: jwtPayload.resource_access['nest-client'].roles as Role[],
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

  isValidLogin(userLoginInformation: UserLoginInformation): void {
    this.tokenService.login(userLoginInformation);
  }
}
