// services/delete-book.gql.ts
import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteBookGQL extends Mutation<{ delete: boolean }, { id: string }> {
  document = gql`
    mutation deleteBook($id: ID!) {
      delete(id: $id)
    }
  `;
}
