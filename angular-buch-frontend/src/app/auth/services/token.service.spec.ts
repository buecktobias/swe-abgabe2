/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { LoginGQL } from '../graphql/login.gql';
import { SessionTokens, TokenResult } from '../models/session-tokens.model';
import { createGraphQLError } from '../../shared/test-helpers';
import { LoginErrorType } from '../models/login-result.model';
import { UserLoginInformation } from '../models/user-login-information.model';

describe('TokenService', () => {
  let tokenService: TokenService;
  let controller: ApolloTestingController;
  const validUser: UserLoginInformation = { username: 'validUser', password: 'validPassword' };
  const wrongUser: UserLoginInformation = { username: 'wrongUser', password: 'wrongPassword' };
  const normalUser: UserLoginInformation = { username: 'normalUser', password: 'normalPassword' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [TokenService],
    });

    tokenService = TestBed.inject(TokenService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(tokenService).toBeTruthy();
  });

  it('login should be successful', (done) => {
    const mockTokenResponse: { token: TokenResult } = {
      token: {
        access_token: 'mockAccessToken',
        expires_in: 3600,
        refresh_token: 'mockRefreshToken',
        refresh_expires_in: 7200,
      },
    };
    const sessionTokens = new SessionTokens(
      mockTokenResponse.token.access_token,
      mockTokenResponse.token.expires_in,
      mockTokenResponse.token.refresh_token,
      mockTokenResponse.token.refresh_expires_in,
    );

    tokenService.login(validUser).subscribe({
      next: (result) => {
        expect(result.meta.success).toBe(true);
        expect(result.meta.errorType).toBe(LoginErrorType.NONE);
        expect(result.sessionTokens).toEqual(sessionTokens);
        done();
      },
      error: () => {
        fail('Expected successful login, but received an error');
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.flush({ data: mockTokenResponse });
  });

  it('should return WrongInputError metadata on BAD_USER_INPUT GraphQL error', (done) => {
    tokenService.login(wrongUser).subscribe({
      next: (result) => {
        expect(result.meta.success).toBe(false);
        expect(result.meta.errorType).toBe(LoginErrorType.WRONG_INPUT);
        expect(result.sessionTokens).toBeNull();
        done();
      },
      error: () => {
        fail('Expected a handled error with metadata, but received a thrown error');
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.graphqlErrors([createGraphQLError('Invalid credentials', 'BAD_USER_INPUT')]);
  });

  it('should return GraphQL error metadata for other GraphQL errors', (done) => {
    tokenService.login(normalUser).subscribe({
      next: (result) => {
        expect(result.meta.success).toBe(false);
        expect(result.meta.errorType).toBe(LoginErrorType.GRAPH_QL);
        expect(result.sessionTokens).toBeNull();
        done();
      },
      error: () => {
        fail('Expected a handled error with metadata, but received a thrown error');
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.graphqlErrors([createGraphQLError('Unexpected server error')]);
  });

  it('should return Network error metadata for network errors', (done) => {
    tokenService.login(normalUser).subscribe({
      next: (result) => {
        expect(result.meta.success).toBe(false);
        expect(result.meta.errorType).toBe(LoginErrorType.NETWORK);
        expect(result.sessionTokens).toBeNull();
        done();
      },
      error: () => {
        fail('Expected a handled error with metadata, but received a thrown error');
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.networkError(new Error('Network error'));
  });

  it('should return Unknown error metadata for unknown errors', (done) => {
    tokenService.login(normalUser).subscribe({
      next: (result) => {
        expect(result.meta.success).toBe(false);
        expect(result.meta.errorType).toBe(LoginErrorType.UNKNOWN);
        expect(result.sessionTokens).toBeNull();
        done();
      },
      error: () => {
        fail('Expected a handled error with metadata, but received a thrown error');
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.flush({ data: null });
  });
});
