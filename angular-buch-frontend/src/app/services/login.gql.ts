// services/login.gql.ts
import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { TokenResult } from '../graphql/payloads';

@Injectable({
  providedIn: 'root',
})
export class LoginGQL extends Mutation<
  { token: TokenResult },
  { username: string; password: string }
> {
  document = gql`
    mutation login($username: String!, $password: String!) {
      token(username: $username, password: $password) {
        access_token
        expires_in
        refresh_token
        refresh_expires_in
      }
    }
  `;
}
