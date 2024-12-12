/* eslint-disable @typescript-eslint/naming-convention */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { of } from 'rxjs';
import { SessionTokens } from '../models/session-tokens.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { LoginResultFactory } from './login-result-factory.service';
import { JWTPayload } from '../models/jwt-payload.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { LoginErrorType, LoginMeta, LoginResult } from '../models/login-result.model';
import { ENV_CONFIG, EnvironmentConfig, LogLevel } from '../../../environments/environment.config';
import { TimeDifference } from '../../shared/models/time-difference.model';

class MockTokenService {
  login = jasmine.createSpy();
  refresh = jasmine.createSpy();
}

function encode(jwtPayload: JWTPayload): string {
  const base64JwtPayload = btoa(JSON.stringify(jwtPayload));
  return `header.${base64JwtPayload}.signature`;
}

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: MockTokenService;
  const loginResultFactory = new LoginResultFactory();
  const validUser: UserLoginInformation = { username: 'validUser', password: 'validPassword' };
  const normalUser: UserLoginInformation = { username: 'normalUser', password: 'normalPassword' };
  const accessTokenExpiration = TimeDifference.inSeconds(3600);
  const refreshTokenExpiration = TimeDifference.inSeconds(7200);
  const authServiceRefreshBufferTime = TimeDifference.inSeconds(5);
  const jwtPayload: JWTPayload = {
    preferred_username: 'admin',
    given_name: 'Admin',
    family_name: 'Nest',
    email: 'admin@acme.com',
    resource_access: {
      'nest-client': {
        roles: ['admin', 'user'],
      },
    },
  };
  const mockedUser: User = {
    username: jwtPayload.preferred_username,
    firstName: jwtPayload.given_name,
    lastName: jwtPayload.family_name,
    email: jwtPayload.email,
    roles: new Set(jwtPayload.resource_access['nest-client'].roles as Role[]),
  };
  let mockJwt: string;
  let successfulLoginResult: LoginResult;
  let successfulSessionTokens: SessionTokens = new SessionTokens('', accessTokenExpiration, '', refreshTokenExpiration);

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useClass: MockTokenService },
        {
          provide: ENV_CONFIG,
          useValue: {
            logLevel: LogLevel.DEBUG,
            accessTokenRefreshBufferTime: authServiceRefreshBufferTime,
          } as EnvironmentConfig,
        },
        AuthService,
      ],
    });
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService) as unknown as MockTokenService;
    mockJwt = encode(jwtPayload);
    successfulSessionTokens = new SessionTokens(mockJwt, accessTokenExpiration, 'refresh', refreshTokenExpiration);
    successfulLoginResult = loginResultFactory.success(successfulSessionTokens);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('#login', () => {
    it('should decode JWT and set the User correctly when credentials are valid', () => {
      tokenService.login.and.returnValue(of(successfulLoginResult));
      console.log(authService.login(validUser));
      authService.login(validUser).subscribe((result) => {
        expect(result.success).toBeTrue();
        expect(tokenService.login).toHaveBeenCalledWith(validUser);
        expect(authService.user?.email).toBe(mockedUser.email);
      });
    });

    it('should handle unexpected errors without setting session tokens', () => {
      tokenService.login.and.returnValue(of(loginResultFactory.failure(LoginErrorType.GRAPH_QL, 'graphql error')));

      authService.login(normalUser).subscribe((result) => {
        expect(result.success).toBeFalse();
        expect(result.errorType).toBe(LoginErrorType.GRAPH_QL);
        expect(authService.user).toBeNull();
        expect(tokenService.login).toHaveBeenCalledWith(normalUser);
      });
    });
  });

  describe('#setupAutoRefresh', () => {
    it('should refresh the token before it expires', fakeAsync(() => {
      tokenService.login.and.returnValue(of(successfulLoginResult));
      tokenService.refresh.and.returnValue(of(successfulSessionTokens));

      authService.login(validUser).subscribe((metaInformation: LoginMeta) => {
        console.log(metaInformation);
      });

      tick(accessTokenExpiration.milliseconds - authServiceRefreshBufferTime.milliseconds);

      expect(tokenService.refresh).toHaveBeenCalledWith(successfulSessionTokens.refreshToken);
      expect(authService.isLoggedIn()).toBeTrue();
      authService.logout();
    }));

    it('should log out if token refresh fails', fakeAsync(() => {
      tokenService.login.and.returnValue(of(successfulLoginResult));
      tokenService.refresh.and.returnValue(of(null));

      authService.login(validUser).subscribe((metaInformation: LoginMeta) => {
        console.log(metaInformation);
      });

      tick(accessTokenExpiration.milliseconds - authServiceRefreshBufferTime.milliseconds);

      expect(authService.isLoggedIn()).toBeFalse();
      expect(authService.user).toBeNull();
    }));
  });
});
