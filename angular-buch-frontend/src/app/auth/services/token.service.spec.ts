/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';

import { ApplicationError, TokenService, WrongInputError } from './token.service';
import { GetBooksGQL } from '../../books/graphql/queries/get-books.gql';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { LoginGQL } from '../graphql/login.gql';
import { SessionTokens, TokenResult } from '../models/session-tokens.model';
import { ApolloError } from '@apollo/client/errors';
import { createGraphQLError } from '../../shared/test-helpers';

describe('TokenService', () => {
  let tokenService: TokenService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [GetBooksGQL, TokenService],
    });

    tokenService = TestBed.inject(TokenService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(tokenService).toBeTruthy();
  });
  it('login should be successful', (done) => {
    const mockTokenResponse = {
      token: {
        access_token: 'mockAccessToken',
        expires_in: 3600,
        refresh_token: 'mockRefreshToken',
        refresh_expires_in: 7200,
      } as TokenResult,
    } as { token: TokenResult };
    const sessionTokens = SessionTokens.fromTokenResult(mockTokenResponse.token);

    tokenService.login('admin', '1234').subscribe({
      next: (result) => {
        expect(result).toEqual(sessionTokens);
        done();
      },
      error: () => {
        fail('Expected successful login, but received an error');
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.flush({
      data: mockTokenResponse,
    });
  });
  it('should throw WrongInputError on BAD_USER_INPUT GraphQL error', (done) => {
    tokenService.login('user', 'wrong-password').subscribe({
      next: () => {
        fail('Expected an error');
      },
      error: (error: ApolloError) => {
        expect(error).toBeInstanceOf(WrongInputError);
        expect(error.message).toBe('The provided username or password is incorrect.');
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.graphqlErrors([createGraphQLError('Invalid credentials', 'BAD_USER_INPUT')]);
  });

  it('should throw ApplicationError for other GraphQL errors', (done) => {
    tokenService.login('user', 'password').subscribe({
      next: () => {
        fail('Expected an error');
      },
      error: (error: ApolloError) => {
        expect(error).toBeInstanceOf(ApplicationError);
        expect(error.message).toContain('Unexpected server error');
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.graphqlErrors([createGraphQLError('Unexpected server error')]);
  });

  it('should throw ApplicationError for unknown errors', (done) => {
    tokenService.login('user', 'password').subscribe({
      next: () => {
        fail('Expected an error');
      },
      error: (error: ApolloError) => {
        expect(error).toBeInstanceOf(ApplicationError);
        expect(error.message);
        done();
      },
    });

    const op = controller.expectOne(TestBed.inject(LoginGQL).document);
    op.graphqlErrors([createGraphQLError('Unexpected server error')]);
  });
});
