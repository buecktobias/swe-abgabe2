import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { TokenResult } from '../../graphql/payloads.model';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenGQL extends Mutation<{ refresh: TokenResult }, { refresh_token: string }> {
  document = gql`
    mutation refreshToken($refresh_token: String!) {
      refresh(refresh_token: $refresh_token) {
        access_token
        expires_in
        refresh_token
        refresh_expires_in
      }
    }
  `;
}
