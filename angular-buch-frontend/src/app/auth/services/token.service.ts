import { Injectable } from '@angular/core';
import { LoginGQL } from '../graphql/login.gql';
import { ApolloError } from '@apollo/client/errors';
import { SessionTokens, TokenResult } from '../models/session-tokens.model';
import { MutationResult } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginErrorType, LoginResult } from '../models/login-result.model';
import { UserLoginInformation } from '../models/user-login-information.model';
import { LoginResultFactory } from './login-result-factory.service';
import { RefreshTokenGQL } from '../graphql/refresh-token.gql';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(
    private readonly loginResultFactory: LoginResultFactory,
    private readonly loginGQL: LoginGQL,
    private readonly refreshTokenGQL: RefreshTokenGQL,
  ) {}

  login(userLoginInformation: UserLoginInformation): Observable<LoginResult> {
    const { username, password } = userLoginInformation;
    return this.loginGQL.mutate({ username, password }).pipe(
      map((response: MutationResult<{ token: TokenResult }>) => {
        if (!response.data?.token) {
          return this.loginResultFactory.createUnSuccessfulLoginResult(LoginErrorType.UNKNOWN);
        }
        return this.loginResultFactory.createSuccessfulLoginResult(SessionTokens.fromTokenResult(response.data.token));
      }),
      catchError((error: ApolloError) => {
        if (this.isBadUserInputError(error)) {
          return of(this.loginResultFactory.createUnSuccessfulLoginResult(LoginErrorType.WRONG_INPUT, 'Wrong username or password'));
        }
        return this.handleApplicationErrors(error);
      }),
    );
  }

  refresh(refreshToken: string): Observable<SessionTokens | null> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return this.refreshTokenGQL.mutate({ refresh_token: refreshToken }).pipe(
      map((response: MutationResult<{ refresh: TokenResult }>) => {
        if (!response.data?.refresh) {
          return null;
        }
        return SessionTokens.fromTokenResult(response.data.refresh);
      }),
    );
  }

  private isBadUserInputError(error: ApolloError): boolean {
    return error.graphQLErrors.some((graphQLError) => graphQLError.extensions?.['code'] === 'BAD_USER_INPUT');
  }

  private handleApplicationErrors(error: ApolloError): Observable<LoginResult> {
    if (error.graphQLErrors.length > 0) {
      const messages = error.graphQLErrors.map((e) => e.message).join('\n');
      return of(this.loginResultFactory.createUnSuccessfulLoginResult(LoginErrorType.GRAPH_QL, messages));
    }

    if (error.networkError) {
      return of(this.loginResultFactory.createUnSuccessfulLoginResult(LoginErrorType.NETWORK, error.message));
    }

    return of(this.loginResultFactory.createUnSuccessfulLoginResult(LoginErrorType.UNKNOWN, error.message));
  }
}
