/* eslint-disable @typescript-eslint/naming-convention */
export class SessionTokens {
  constructor(
    public readonly accessToken: string,
    public readonly accessTokenExpiresInSeconds: number,
    public readonly refreshToken: string,
    public readonly refreshTokenExpiresInSeconds: number,
  ) {}

  static fromTokenResult(tokenResult: TokenResult): SessionTokens {
    return new SessionTokens(tokenResult.access_token, tokenResult.expires_in, tokenResult.refresh_token, tokenResult.refresh_expires_in);
  }

  getAccessTokenExpirationDate(): Date {
    return new Date(Date.now() + this.accessTokenExpiresInSeconds * 1000);
  }

  getRefreshTokenExpirationDate(): Date {
    return new Date(Date.now() + this.refreshTokenExpiresInSeconds * 1000);
  }

  isAccessTokenExpired(): boolean {
    return Date.now() > this.getAccessTokenExpirationDate().getTime();
  }

  isRefreshTokenExpired(): boolean {
    return Date.now() > this.getRefreshTokenExpirationDate().getTime();
  }
}

export interface TokenResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}
