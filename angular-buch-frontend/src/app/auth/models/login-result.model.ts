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
