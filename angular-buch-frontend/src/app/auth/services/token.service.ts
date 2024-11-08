/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { LoginGQL } from '../graphql/login.gql';
import { ApolloError } from '@apollo/client/errors';
import { SessionTokens, TokenResult } from '../models/session-tokens.model';
import { MutationResult } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginErrorType, LoginResult } from '../models/login-token.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private readonly loginGQL: LoginGQL) {}

  login(username: string, password: string): Observable<LoginResult> {
    return this.loginGQL.mutate({ username, password }).pipe(
      map((response: MutationResult<{ token: TokenResult }>) => {
        if (!response.data?.token) {
          return new LoginResult(null, {
            success: false,
            message: 'An unknown error occurred during login.',
            errorType: LoginErrorType.UNKNOWN,
          });
        }
        const sessionTokens = this.extractTokens(response);
        return new LoginResult(sessionTokens, {
          success: true,
          message: 'Login successful',
          errorType: LoginErrorType.NONE,
        });
      }),
      catchError((error: ApolloError) => {
        if (this.isBadUserInputError(error)) {
          return of(
            new LoginResult(null, {
              success: false,
              message: 'The provided username or password is incorrect.',
              errorType: LoginErrorType.WRONG_INPUT,
            }),
          );
        }

        if (error.graphQLErrors.length > 0) {
          const messages = error.graphQLErrors.map((e) => e.message).join('\n');
          return of(
            new LoginResult(null, {
              success: false,
              message: `GraphQL errors during login:\n${messages}`,
              errorType: LoginErrorType.GRAPH_QL,
            }),
          );
        }

        if (error.networkError) {
          return of(
            new LoginResult(null, {
              success: false,
              message: 'Network error occurred.',
              errorType: LoginErrorType.NETWORK,
            }),
          );
        }

        return of(
          new LoginResult(null, {
            success: false,
            message: 'An unknown error occurred during login.',
            errorType: LoginErrorType.UNKNOWN,
          }),
        );
      }),
    );
  }

  private extractTokens(response: MutationResult<{ token: TokenResult }>): SessionTokens {
    if (!response.data?.token) {
      throw new Error('No token data received.');
    }
    const { access_token, refresh_token, refresh_expires_in, expires_in } = response.data.token;
    return new SessionTokens(access_token, expires_in, refresh_token, refresh_expires_in);
  }

  private isBadUserInputError(error: ApolloError): boolean {
    return error.graphQLErrors.some((graphQLError) => graphQLError.extensions?.['code'] === 'BAD_USER_INPUT');
  }
}
