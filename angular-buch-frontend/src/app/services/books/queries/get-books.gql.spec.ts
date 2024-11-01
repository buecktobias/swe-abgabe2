import { TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { GetBooksGQL } from './get-books.gql';
import { GraphQLFormattedError } from 'graphql';
import { mockBooks } from '../books.mock';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';

loadDevMessages();
loadErrorMessages();
describe('GetBooksGQL', () => {
  let getBooksGQL: GetBooksGQL;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [GetBooksGQL],
    });

    getBooksGQL = TestBed.inject(GetBooksGQL);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should fetch books successfully', (done) => {
    getBooksGQL
      .watch({
        suchkriterien: {},
      })
      .valueChanges.subscribe((result) => {
        expect(result.data.buecher).toEqual(mockBooks);
        done();
      });

    const op = controller.expectOne(getBooksGQL.document);

    op.flush({
      data: {
        buecher: mockBooks,
      },
    });
  });

  it('should handle errors gracefully', (done) => {
    getBooksGQL.watch({ suchkriterien: {} }).valueChanges.subscribe({
      next: () => fail('Should have errored'),
      error: (error) => {
        expect(error.message).toContain('Test Error');
        done();
      },
    });

    const op = controller.expectOne(getBooksGQL.document);

    // noinspection JSUnusedGlobalSymbols toJSON is a required attribute!
    op.graphqlErrors([
      {
        message: 'Test Error',
        locations: undefined,
        path: undefined,
        nodes: undefined,
        source: undefined,
        positions: undefined,
        originalError: undefined,
        extensions: {
          code: 'UNAUTHORIZED',
          severity: 'HIGH',
        },
        toJSON: function (): GraphQLFormattedError {
          throw new Error('Function not implemented.');
        },
        [Symbol.toStringTag]: '',
        name: '',
      },
    ]);
  });
});
