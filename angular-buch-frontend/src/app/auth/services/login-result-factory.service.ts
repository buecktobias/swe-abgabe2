import { SessionTokens } from '../models/session-tokens.model';
import { LoginErrorType, LoginResult } from '../models/login-result.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginResultFactory {
  createSuccessfulLoginResult(sessionTokens: SessionTokens): LoginResult {
    return {
      sessionTokens,
      meta: {
        success: true,
        errorType: LoginErrorType.NONE,
        message: '',
      },
    };
  }

  createUnSuccessfulLoginResult(errorType: LoginErrorType, message = ''): LoginResult {
    return {
      sessionTokens: null,
      meta: {
        success: false,
        errorType,
        message,
      },
    };
  }
}
