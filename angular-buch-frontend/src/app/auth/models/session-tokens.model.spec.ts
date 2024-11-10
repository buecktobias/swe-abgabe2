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
    expect(sessionTokens.accessToken).toBe(tokenResult.access_token);
    expect(sessionTokens.accessTokenExpiresIn.seconds).toBe(tokenResult.expires_in);
    expect(sessionTokens.refreshToken).toBe(tokenResult.refresh_token);
    expect(sessionTokens.refreshTokenExpiresIn.seconds).toBe(tokenResult.refresh_expires_in);
  });
});
