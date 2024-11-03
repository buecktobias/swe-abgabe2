import { Injectable } from '@angular/core';
import { LoginGQL } from './login.gql';
import { ApolloError } from '@apollo/client/errors';
import { SessionTokens } from './sessionTokens.model';
import { TokenResult } from '../../../graphql/payloads.model';
import { MutationResult } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

class WrongInputError extends Error {}

class ApplicationError extends Error {}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private readonly loginGQL: LoginGQL) {}

  login(username: string, password: string): Observable<SessionTokens> {
    return this.loginGQL.mutate({ username, password }).pipe(
      map((response: MutationResult<{ token: TokenResult }>) => {
        if (!response.data?.token) {
          throw new ApplicationError('No token data received.');
        }
        const tokenResult: TokenResult = response.data.token;
        return new SessionTokens(
          tokenResult.access_token,
          tokenResult.expires_in,
          tokenResult.refresh_token,
          tokenResult.refresh_expires_in,
        );
      }),
      catchError((error: ApolloError) => {
        console.error('Login failed:', error);

        const badUserInputError = error.graphQLErrors.find((graphQLError) => graphQLError.extensions?.['code'] === 'BAD_USER_INPUT');

        if (badUserInputError) {
          return throwError(() => new WrongInputError('The provided username or password is incorrect.'));
        } else if (error.graphQLErrors.length > 0) {
          const message = error.graphQLErrors.map((e) => e.message).join('\n');
          return throwError(() => new ApplicationError('Following errors occurred during login:\n' + message));
        } else if (error.networkError) {
          return throwError(() => new ApplicationError('Network error:'));
        } else {
          return throwError(() => new ApplicationError('Unknown error occurred during login.'));
        }
      }),
    );
  }
}
