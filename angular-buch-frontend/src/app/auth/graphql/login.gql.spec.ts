/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { LoginGQL } from './login.gql';
import { TokenResult } from '../models/session-tokens.model';
import { ApolloError } from '@apollo/client/errors';
import { createGraphQLError } from '../../shared/test-helpers';

describe('LoginGQL', () => {
  let loginGQL: LoginGQL;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [LoginGQL],
    });

    loginGQL = TestBed.inject(LoginGQL);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(loginGQL).toBeTruthy();
  });

  it('should execute login mutation and return token result', (done) => {
    const mockResponse: { token: TokenResult } = {
      token: {
        access_token: 'mockAccessToken',
        expires_in: 3600,
        refresh_token: 'mockRefreshToken',
        refresh_expires_in: 7200,
      },
    };

    loginGQL.mutate({ username: 'validUser', password: 'validPassword' }).subscribe((result) => {
      expect(result.data?.token).toEqual(mockResponse.token);
      done();
    });

    const op = controller.expectOne(loginGQL.document);

    expect(op.operation.variables).toEqual({ username: 'validUser', password: 'validPassword' });
    op.flush({
      data: mockResponse,
    });
  });

  it('should handle error response from login mutation', (done) => {
    loginGQL.mutate({ username: 'invalidUser', password: 'wrongPassword' }).subscribe({
      next: () => {
        fail('Expected error, but got success');
      },
      error: (error: ApolloError) => {
        expect(error).toBeTruthy();
        expect(error.graphQLErrors[0].message).toBe('Invalid credentials');
        done();
      },
    });

    const op = controller.expectOne(loginGQL.document);

    op.graphqlErrors([createGraphQLError('Invalid credentials')]);
  });
});
