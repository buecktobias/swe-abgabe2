/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { RefreshTokenGQL } from './refresh-token.gql';
import { TokenResult } from '../models/session-tokens.model';
import { ApolloError } from '@apollo/client/errors';
import { createGraphQLError } from '../../shared/test-helpers';

describe('RefreshTokenGQL', () => {
  let refreshTokenGQL: RefreshTokenGQL;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [RefreshTokenGQL],
    });

    refreshTokenGQL = TestBed.inject(RefreshTokenGQL);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(refreshTokenGQL).toBeTruthy();
  });

  it('should execute refresh token mutation and return token result', (done) => {
    const mockResponse: { refresh: TokenResult } = {
      refresh: {
        access_token: 'mockAccessToken',
        expires_in: 3600,
        refresh_token: 'mockRefreshToken',
        refresh_expires_in: 7200,
      },
    };

    refreshTokenGQL.mutate({ refresh_token: 'validRefreshToken' }).subscribe((result) => {
      expect(result.data?.refresh).toEqual(mockResponse.refresh);
      done();
    });

    const op = controller.expectOne(refreshTokenGQL.document);

    expect(op.operation.variables).toEqual({ refresh_token: 'validRefreshToken' });
    op.flush({
      data: mockResponse,
    });
  });

  it('should handle error response from refresh token mutation', (done) => {
    refreshTokenGQL.mutate({ refresh_token: 'invalidRefreshToken' }).subscribe({
      next: () => {
        fail('Expected error, but got success');
      },
      error: (error: ApolloError) => {
        expect(error).toBeTruthy();
        expect(error.graphQLErrors[0].message).toBe('Invalid refresh token');
        done();
      },
    });

    const op = controller.expectOne(refreshTokenGQL.document);

    op.graphqlErrors([createGraphQLError('Invalid refresh token')]);
  });
});
