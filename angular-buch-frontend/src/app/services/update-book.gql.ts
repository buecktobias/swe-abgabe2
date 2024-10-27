// services/update-book.gql.ts
import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { UpdatePayload } from '../graphql/payloads';
import { BuchUpdateInput } from '../graphql/inputs';

@Injectable({
  providedIn: 'root',
})
export class UpdateBookGQL extends Mutation<
  { update: UpdatePayload },
  { input: BuchUpdateInput }
> {
  document = gql`
    mutation updateBook($input: BuchUpdateInput!) {
      update(input: $input) {
        version
      }
    }
  `;
}
