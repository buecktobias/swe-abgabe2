/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { of } from 'rxjs';
import { SessionTokens } from '../models/session-tokens.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { LoginResultFactory } from './login-result-factory.service';
import { JwtService } from './jwt.service';
import { JwtPayload } from '../models/jwt-payload.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { LoginErrorType } from '../models/login-result.model';

class MockTokenService {
  login = jasmine.createSpy();
}

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: MockTokenService;
  let jwtService: JwtService;
  const loginResultFactory = new LoginResultFactory();
  const validUser: UserLoginInformation = { username: 'validUser', password: 'validPassword' };
  const normalUser: UserLoginInformation = { username: 'normalUser', password: 'normalPassword' };

  const jwtPayload: JwtPayload = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: TokenService, useClass: MockTokenService }, JwtService],
    });

    authService = TestBed.inject(AuthService);
    jwtService = TestBed.inject(JwtService);
    tokenService = TestBed.inject(TokenService) as unknown as MockTokenService;
    mockJwt = jwtService.encode(jwtPayload);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('#login', () => {
    it('should decode JWT and set the User correctly when credentials are valid', () => {
      const decodedTokens = new SessionTokens(mockJwt, 3600, '', 7200);
      tokenService.login.and.returnValue(of(loginResultFactory.createSuccessfulLoginResult(decodedTokens)));

      authService.login(validUser).subscribe((result) => {
        expect(result.success).toBeTrue();
        expect(tokenService.login).toHaveBeenCalledWith(validUser);

        expect(authService.user).toEqual(mockedUser);
      });
    });

    it('should handle unexpected errors without setting session tokens', () => {
      tokenService.login.and.returnValue(of(loginResultFactory.createUnSuccessfulLoginResult(LoginErrorType.GRAPH_QL, 'graphql error')));

      authService.login(normalUser).subscribe((result) => {
        expect(result.success).toBeFalse();
        expect(result.errorType).toBe(LoginErrorType.GRAPH_QL);
        expect(authService.user).toBeNull();
        expect(tokenService.login).toHaveBeenCalledWith(normalUser);
      });
    });
  });
});
