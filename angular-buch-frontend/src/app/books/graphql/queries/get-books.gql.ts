import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { Buch } from '../../models/buch.model';
import { SuchkriterienInput } from '../../models/suchkriterien-input.model';

export interface GetBooksResponse {
  buecher: Buch[];
}

@Injectable({
  providedIn: 'root',
})
export class GetBooksGQL extends Query<GetBooksResponse, { suchkriterien: SuchkriterienInput }> {
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
