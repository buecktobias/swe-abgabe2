/* eslint-disable @typescript-eslint/naming-convention */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { of } from 'rxjs';
import { SessionTokens } from '../models/session-tokens.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { LoginResultFactory } from './login-result-factory.service';
import { JwtService } from './jwt.service';
import { JWTPayload } from '../models/jwt-payload.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { LoginErrorType, LoginResult } from '../models/login-result.model';
import { ENV_CONFIG, LogLevel } from '../../../environments/environment.config';

class MockTokenService {
  login = jasmine.createSpy();
  refresh = jasmine.createSpy();
}

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: MockTokenService;
  let jwtService: JwtService;
  const loginResultFactory = new LoginResultFactory();
  const validUser: UserLoginInformation = { username: 'validUser', password: 'validPassword' };
  const normalUser: UserLoginInformation = { username: 'normalUser', password: 'normalPassword' };
  const accessTokenExpirationSeconds = 3600;
  const refreshTokenExpirationSeconds = 7200;
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
  const refreshedSessionTokens: SessionTokens = new SessionTokens('', accessTokenExpirationSeconds, '', refreshTokenExpirationSeconds);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: TokenService, useClass: MockTokenService },
        JwtService,
        {
          provide: ENV_CONFIG,
          useValue: { logLevel: LogLevel.DEBUG },
        },
      ],
    });
    spyOn(localStorage, 'getItem').and.returnValue(null);
    authService = TestBed.inject(AuthService);
    jwtService = TestBed.inject(JwtService);
    tokenService = TestBed.inject(TokenService) as unknown as MockTokenService;
    mockJwt = jwtService.encode(jwtPayload);
    successfulLoginResult = loginResultFactory.success(
      new SessionTokens(mockJwt, accessTokenExpirationSeconds, 'refreshToken', refreshTokenExpirationSeconds),
    );
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('#login', () => {
    it('should decode JWT and set the User correctly when credentials are valid', () => {
      tokenService.login.and.returnValue(of(successfulLoginResult));

      authService.login(validUser).subscribe((result) => {
        expect(result.success).toBeTrue();
        expect(tokenService.login).toHaveBeenCalledWith(validUser);

        expect(authService.user).toEqual(mockedUser);
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
      tokenService.refresh.and.returnValue(of(refreshedSessionTokens));

      authService.login(validUser).subscribe();

      tick((accessTokenExpirationSeconds - authService.refreshBufferSeconds) * 1000);

      expect(tokenService.refresh).toHaveBeenCalledWith('refreshToken');
      expect(authService.isLoggedIn).toBeTrue();
    }));

    it('should log out if token refresh fails', fakeAsync(() => {
      tokenService.login.and.returnValue(of(successfulLoginResult));
      tokenService.refresh.and.returnValue(of(null));

      authService.login(validUser).subscribe();

      tick((accessTokenExpirationSeconds - authService.refreshBufferSeconds) * 1000);
      tick(1000);

      expect(authService.isLoggedIn).toBeFalse();
      expect(authService.user).toBeNull();
    }));
  });
});
