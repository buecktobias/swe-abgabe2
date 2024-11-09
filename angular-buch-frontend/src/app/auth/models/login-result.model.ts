import { SessionTokens } from '../models/session-tokens.model';

export enum LoginErrorType {
  NONE = 'NONE',
  WRONG_INPUT = 'WRONG_INPUT',
  GRAPH_QL = 'GRAPH_QL',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
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
