import { Injectable } from '@angular/core';
import { GetBooksGQL, GetBooksResponse } from '../graphql/queries/get-books.gql';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { SuchkriterienInput } from '../models/suchkriterien-input.model';
import { GetBookByIdGQL, GetBookByIdResponse } from '../graphql/queries/get-book-by-id.gql';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(
    private readonly getBooksGQL: GetBooksGQL,
    private readonly getBookByIdGQL: GetBookByIdGQL,
  ) {}

  getAllBooks(): Observable<ApolloQueryResult<GetBooksResponse>> {
    return this.getBooksGQL.watch({
      suchkriterien: {},
    }).valueChanges;
  }

  getBooksBy(suchkriterien: SuchkriterienInput): Observable<ApolloQueryResult<GetBooksResponse>> {
    return this.getBooksGQL.watch({ suchkriterien }).valueChanges;
  }

  getBookById(id: number): Observable<ApolloQueryResult<GetBookByIdResponse>> {
    return this.getBookByIdGQL.watch({ id }).valueChanges;
  }
}
