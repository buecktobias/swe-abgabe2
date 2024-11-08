import { SessionTokens } from '../models/session-tokens.model';

export enum LoginErrorType {
  NONE = 'None',
  WRONG_INPUT = 'WrongInput',
  GRAPH_QL = 'GraphQL',
  NETWORK = 'Network',
  UNKNOWN = 'Unknown',
}

export interface LoginMeta {
  success: boolean;
  message: string;
  errorType: LoginErrorType;
}

export class LoginResult {
  constructor(
    public sessionTokens: SessionTokens | null,
    public meta: LoginMeta,
  ) {}
}
