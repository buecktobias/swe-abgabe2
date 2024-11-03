export class SessionTokens {
  constructor(
    public readonly accessToken: string,
    public readonly accessTokenExpiresInSeconds: number,
    public readonly refreshToken: string,
    public readonly refreshTokenExpiresInSeconds: number,
  ) {}

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
