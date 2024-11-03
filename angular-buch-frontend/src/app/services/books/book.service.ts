import { Injectable } from '@angular/core';
import { GetBooksGQL, GetBooksResponse } from './queries/get-books.gql';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { SuchkriterienInput } from '../../graphql/inputs.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private readonly getBooksGQL: GetBooksGQL) {}

  getAllBooks(): Observable<ApolloQueryResult<GetBooksResponse>> {
    return this.getBooksGQL.watch({
      suchkriterien: {},
    }).valueChanges;
  }

  getBooksBy(suchkriterien: SuchkriterienInput): Observable<ApolloQueryResult<GetBooksResponse>> {
    return this.getBooksGQL.watch({ suchkriterien }).valueChanges;
  }
}
