import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { of, throwError } from 'rxjs';
import { SessionTokens } from '../models/session-tokens.model';
import { LoginErrorType, LoginResult } from '../models/login-token.model';
import { ApolloError } from '@apollo/client/errors';

class MockTokenService {
  login = jasmine.createSpy();
}

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: MockTokenService;

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
    xit('should call TokenService login and set sessionTokens and currentUser on success', () => {
      const mockTokens = new SessionTokens('access', 3600, 'refresh', 7200);
      const loginResult = new LoginResult(mockTokens, {
        success: true,
        message: 'Login successful',
        errorType: LoginErrorType.NONE,
      });

      tokenService.login.and.returnValue(of(loginResult));
      authService.login('validUser', 'validPassword');

      expect(tokenService.login).toHaveBeenCalledWith('validUser', 'validPassword');
      // Additional expectations could verify if authService sets currentUser and sessionTokens
    });

    xit('should handle WrongInputError without setting sessionTokens and currentUser', () => {
      const loginResult = new LoginResult(null, {
        success: false,
        message: 'The provided username or password is incorrect.',
        errorType: LoginErrorType.WRONG_INPUT,
      });

      tokenService.login.and.returnValue(of(loginResult));
      authService.login('invalidUser', 'wrongPassword');

      expect(tokenService.login).toHaveBeenCalledWith('invalidUser', 'wrongPassword');
      // Verify that sessionTokens and currentUser remain null on error
    });

    xit('should handle unknown errors without setting sessionTokens and currentUser', () => {
      const error = new ApolloError({ errorMessage: 'Unexpected error' });
      tokenService.login.and.returnValue(throwError(() => error));

      authService.login('user', 'password');

      expect(tokenService.login).toHaveBeenCalledWith('user', 'password');
      // Verify that sessionTokens and currentUser remain null on error
    });
  });

  describe('#isValidLogin', () => {
    xit('should call TokenService login to check if credentials are valid', () => {
      authService.isValidLogin('testUser', 'testPassword');
      expect(tokenService.login).toHaveBeenCalledWith('testUser', 'testPassword');
    });
  });
});
