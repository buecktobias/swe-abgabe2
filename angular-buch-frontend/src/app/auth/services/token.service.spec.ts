/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';
import { GetBooksGQL } from '../../books/graphql/queries/get-books.gql';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { LoginGQL } from '../graphql/login.gql';
import { TokenResult } from '../models/payloads.model';
import { SessionTokens } from '../models/session-tokens.model';

describe('TokenService', () => {
  let service: TokenService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [GetBooksGQL, TokenService],
    });

    service = TestBed.inject(TokenService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
    const sessionTokens = new SessionTokens(
      mockTokenResponse.token.access_token,
      mockTokenResponse.token.expires_in,
      mockTokenResponse.token.refresh_token,
      mockTokenResponse.token.refresh_expires_in,
    );

    service.login('admin', '1234').subscribe({
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
});
