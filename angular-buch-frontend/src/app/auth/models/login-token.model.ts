import { SessionTokens } from '../models/session-tokens.model';

export enum LoginErrorType {
  NONE,
  WRONG_INPUT,
  GRAPH_QL,
  NETWORK,
  UNKNOWN,
}

export interface LoginMeta {
  readonly success: boolean;
  readonly message: string;
  readonly errorType: LoginErrorType;
}

export interface LoginResult {
  readonly sessionTokens: SessionTokens | null;
  readonly meta: LoginMeta;
}

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
