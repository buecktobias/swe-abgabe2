/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { of, throwError } from 'rxjs';
import { SessionTokens } from '../models/session-tokens.model';
import { ApolloError } from '@apollo/client/errors';
import { UserLoginInformation } from '../models/user-login-information.model';
import { LoginResultFactory } from './login-result-factory.service';
import { JwtService } from './jwt.service';
import { JwtPayload } from '../models/jwt-payload.model';

class MockTokenService {
  login = jasmine.createSpy();
}

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: MockTokenService;
  const jwtService = new JwtService();
  const loginResultFactory = new LoginResultFactory();
  const validUser: UserLoginInformation = { username: 'validUser', password: 'validPassword' };
  const normalUser: UserLoginInformation = { username: 'normalUser', password: 'normalPassword' };

  const unknownError = new ApolloError({ errorMessage: 'Unexpected error' });
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

  const mockJwt = jwtService.encode(jwtPayload);

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

  it('token can be decoded', () => {
    const decoded = jwtService.decode(mockJwt);
    expect(decoded).toEqual(jwtPayload);
  });

  describe('#login', () => {
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
