import { Injectable } from '@angular/core';
import { LoginGQL } from '../graphql/login.gql';
import { ApolloError } from '@apollo/client/errors';
import { SessionTokens } from '../models/session-tokens.model';
import { TokenResult } from '../models/payloads.model';
import { MutationResult } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class WrongInputError extends Error {}

export class ApplicationError extends Error {}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private readonly loginGQL: LoginGQL) {}

  login(username: string, password: string): Observable<SessionTokens> {
    return this.loginGQL.mutate({ username, password }).pipe(
      map(
        (
          response: MutationResult<{
            token: TokenResult;
          }>,
        ) => this.extractTokens(response),
      ),
      catchError((error: ApolloError) => this.handleError(error)),
    );
  }

  private extractTokens(response: MutationResult<{ token: TokenResult }>): SessionTokens {
    const tokenData = response.data?.token;
    if (!tokenData) {
      throw new ApplicationError('No token data received.');
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token, refresh_token, refresh_expires_in, expires_in } = tokenData;
    return new SessionTokens(access_token, expires_in, refresh_token, refresh_expires_in);
  }

  private handleError(error: ApolloError): Observable<never> {
    console.error('Login failed:', error);

    if (this.isBadUserInputError(error)) {
      return throwError(() => new WrongInputError('The provided username or password is incorrect.'));
    }
    if (error.graphQLErrors.length > 0) {
      const messages = error.graphQLErrors.map((error) => error.message).join('\n');
      return throwError(() => new ApplicationError(`GraphQL errors during login:\n${messages}`));
    }
    if (error.networkError) {
      return throwError(() => new ApplicationError('Network error occurred.'));
    }
    return throwError(() => new ApplicationError('An unknown error occurred during login.'));
  }

  private isBadUserInputError(error: ApolloError): boolean {
    return error.graphQLErrors.some((graphQLError) => graphQLError.extensions?.['code'] === 'BAD_USER_INPUT');
  }
}
