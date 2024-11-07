import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { UpdatePayload } from '../../../auth/models/payloads.model';
import { BuchUpdateInput } from '../../models/buch.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateBookGQL extends Mutation<{ update: UpdatePayload }, { input: BuchUpdateInput }> {
  document = gql`
    mutation updateBook($input: BuchUpdateInput!) {
      update(input: $input) {
        version
      }
    }
  `;
}
