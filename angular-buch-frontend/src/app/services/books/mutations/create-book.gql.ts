import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { CreatePayload } from '../../../graphql/payloads.model';
import { BuchInput } from '../../../graphql/inputs.model';

@Injectable({
  providedIn: 'root',
})
export class CreateBookGQL extends Mutation<{ create: CreatePayload }, { input: BuchInput }> {
  document = gql`
    mutation createBook($input: BuchInput!) {
      create(input: $input) {
        id
      }
    }
  `;
}
