// services/get-book-by-id.gql.ts
import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { BuchEntity } from '../../../graphql/entities';

export interface GetBookByIdResponse {
  buch: BuchEntity;
}

@Injectable({
  providedIn: 'root',
})
export class GetBookByIdGQL extends Query<GetBookByIdResponse, { id: string }> {
  document = gql`
    query getBookById($id: ID!) {
      buch(id: $id) {
        id
        version
        isbn
        rating
        art
        preis
        lieferbar
        datum
        homepage
        schlagwoerter
        titel {
          titel
          untertitel
        }
        rabatt
      }
    }
  `;
}
