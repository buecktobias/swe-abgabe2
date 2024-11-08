/* eslint-disable @typescript-eslint/naming-convention */
import { SessionTokens, TokenResult } from './session-tokens.model';

describe('SessionTokens', () => {
  it('should create an instance from TokenResult', () => {
    const tokenResult: TokenResult = {
      access_token: 'accessToken',
      expires_in: 3600,
      refresh_token: 'refreshToken',
      refresh_expires_in: 7200,
    };
    const sessionTokens = SessionTokens.fromTokenResult(tokenResult);
    expect(sessionTokens.accessToken).toBe('accessToken');
    expect(sessionTokens.accessTokenExpiresInSeconds).toBe(3600);
    expect(sessionTokens.refreshToken).toBe('refreshToken');
    expect(sessionTokens.refreshTokenExpiresInSeconds).toBe(7200);
  });

  it('should return correct access token expiration date', () => {
    const sessionTokens = new SessionTokens('accessToken', 3600, 'refreshToken', 7200);
    const expirationDate = sessionTokens.getAccessTokenExpirationDate();
    expect(expirationDate.getTime()).toBeGreaterThan(Date.now());
  });

  it('should return correct refresh token expiration date', () => {
    const sessionTokens = new SessionTokens('accessToken', 3600, 'refreshToken', 7200);
    const expirationDate = sessionTokens.getRefreshTokenExpirationDate();
    expect(expirationDate.getTime()).toBeGreaterThan(Date.now());
  });

  it('should return true if access token is expired', () => {
    const sessionTokens = new SessionTokens('accessToken', -3600, 'refreshToken', 7200);
    expect(sessionTokens.isAccessTokenExpired()).toBeTrue();
  });

  it('should return false if access token is not expired', () => {
    const sessionTokens = new SessionTokens('accessToken', 3600, 'refreshToken', 7200);
    expect(sessionTokens.isAccessTokenExpired()).toBeFalse();
  });

  it('should return true if refresh token is expired', () => {
    const sessionTokens = new SessionTokens('accessToken', 3600, 'refreshToken', -7200);
    expect(sessionTokens.isRefreshTokenExpired()).toBeTrue();
  });

  it('should return false if refresh token is not expired', () => {
    const sessionTokens = new SessionTokens('accessToken', 3600, 'refreshToken', 7200);
    expect(sessionTokens.isRefreshTokenExpired()).toBeFalse();
  });
});
