/* eslint-disable @typescript-eslint/naming-convention */
import { TimeDifference } from '../../shared/models/time-difference.model';

export class SessionTokens {
  constructor(
    public readonly accessToken: string,
    public readonly accessTokenExpiresIn: TimeDifference,
    public readonly refreshToken: string,
    public readonly refreshTokenExpiresIn: TimeDifference,
  ) {}

  static fromTokenResult(tokenResult: TokenResult): SessionTokens {
    const accessTokenExpiresIn = TimeDifference.inSeconds(tokenResult.expires_in);
    const refreshTokenExpiresIn = TimeDifference.inSeconds(tokenResult.refresh_expires_in);
    return new SessionTokens(tokenResult.access_token, accessTokenExpiresIn, tokenResult.refresh_token, refreshTokenExpiresIn);
  }
}

export interface TokenResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}
