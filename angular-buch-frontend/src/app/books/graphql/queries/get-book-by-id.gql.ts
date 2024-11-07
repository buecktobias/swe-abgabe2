import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';

import { Buch } from '../../models/buch.model';

export interface GetBookByIdResponse {
  buch: Buch;
}

@Injectable({
  providedIn: 'root',
})
export class GetBookByIdGQL extends Query<GetBookByIdResponse, { id: number }> {
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
