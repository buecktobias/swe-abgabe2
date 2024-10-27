// services/get-books.gql.ts
import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { BuchEntity } from '../entities';
import { SuchkriterienInput } from '../graphql/inputs';

export interface GetBooksResponse {
  buecher: BuchEntity[];
}

@Injectable({
  providedIn: 'root',
})
export class GetBooksGQL extends Query<
  GetBooksResponse,
  { suchkriterien: SuchkriterienInput }
> {
  document = gql`
    query getBooks($suchkriterien: SuchkriterienInput) {
      buecher(suchkriterien: $suchkriterien) {
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
