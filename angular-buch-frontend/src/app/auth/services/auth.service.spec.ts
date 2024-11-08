/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { of, throwError } from 'rxjs';
import { SessionTokens } from '../models/session-tokens.model';
import { LoginResultFactory } from '../models/login-token.model';
import { ApolloError } from '@apollo/client/errors';
import { UserLoginInformation } from '../models/user-login-information.model';

class MockTokenService {
  login = jasmine.createSpy();
}

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: MockTokenService;
  const loginResultFactory = new LoginResultFactory();
  const validUser: UserLoginInformation = { username: 'validUser', password: 'validPassword' };
  const normalUser: UserLoginInformation = { username: 'normalUser', password: 'normalPassword' };

  const mockTokens = new SessionTokens('access', 3600, 'refresh', 7200);
  const successLoginResult = loginResultFactory.createSuccessfulLoginResult(mockTokens);
  const unknownError = new ApolloError({ errorMessage: 'Unexpected error' });
  const jwtPayload = {
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

  const base64JwtPayload = btoa(JSON.stringify(jwtPayload));
  const mockJwt = `header.${base64JwtPayload}.signature`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: TokenService, useClass: MockTokenService }],
    });

    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService) as unknown as MockTokenService;
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('#login', () => {
    it('should call TokenService.login and set session tokens when credentials are valid', () => {
      tokenService.login.and.returnValue(of(successLoginResult));

      authService.login(validUser);

      expect(tokenService.login).toHaveBeenCalledWith(validUser);
    });

    it('should decode JWT and set the User correctly when credentials are valid', () => {
      const decodedTokens = new SessionTokens(mockJwt, 3600, 'refresh', 7200);
      tokenService.login.and.returnValue(of(loginResultFactory.createSuccessfulLoginResult(decodedTokens)));

      authService.login(validUser);

      expect(tokenService.login).toHaveBeenCalledWith(validUser);

      const user = authService.user;

      expect(user).toBeTruthy();
      expect(user?.username).toBe('admin');
      expect(user?.firstName).toBe('Admin');
      expect(user?.lastName).toBe('Nest');
      expect(user?.email).toBe('admin@acme.com');
      expect(user?.roles).toContain('admin');
      expect(user?.roles).toContain('user');
    });

    it('should handle unexpected errors without setting session tokens', () => {
      tokenService.login.and.returnValue(throwError(() => unknownError));

      authService.login(normalUser);

      expect(tokenService.login).toHaveBeenCalledWith(normalUser);
    });
  });

  describe('#isValidLogin', () => {
    it('should call TokenService.login to validate credentials', () => {
      authService.isValidLogin(normalUser);

      expect(tokenService.login).toHaveBeenCalledWith(normalUser);
    });
  });
});
