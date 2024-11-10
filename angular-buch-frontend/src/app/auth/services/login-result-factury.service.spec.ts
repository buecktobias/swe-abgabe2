import { LoginResultFactory } from './login-result-factory.service';
import { SessionTokens } from '../models/session-tokens.model';
import { LoginErrorType, LoginResult } from '../models/login-result.model';
import { TimeDifference } from '../../shared/models/time-difference.model';

describe('LoginResultFactory', () => {
  let factory: LoginResultFactory;

  beforeEach(() => {
    factory = new LoginResultFactory();
  });

  describe('success', () => {
    it('should create a successful LoginResult with the provided session tokens', () => {
      const mockSessionTokens: SessionTokens = new SessionTokens(
        '',
        TimeDifference.fromMilliseconds(0),
        '',
        TimeDifference.fromMilliseconds(0),
      );

      const result: LoginResult = factory.success(mockSessionTokens);

      expect(result.sessionTokens).toEqual(mockSessionTokens);
      expect(result.meta.success).toBeTrue();
      expect(result.meta.errorType).toBe(LoginErrorType.NONE);
      expect(result.meta.message).toBe('');
    });
  });

  describe('failure', () => {
    it('should create an unsuccessful LoginResult with the specified error type and message', () => {
      const errorType = LoginErrorType.NETWORK;
      const message = 'Network error occurred';

      const result: LoginResult = factory.failure(errorType, message);

      expect(result.sessionTokens).toBeNull();
      expect(result.meta.success).toBeFalse();
      expect(result.meta.errorType).toBe(errorType);
      expect(result.meta.message).toBe(message);
    });

    it('should create an unsuccessful LoginResult with an empty message if none is provided', () => {
      const errorType = LoginErrorType.WRONG_INPUT;

      const result: LoginResult = factory.failure(errorType);

      expect(result.sessionTokens).toBeNull();
      expect(result.meta.success).toBeFalse();
      expect(result.meta.errorType).toBe(errorType);
      expect(result.meta.message).toBe('');
    });
  });
});
