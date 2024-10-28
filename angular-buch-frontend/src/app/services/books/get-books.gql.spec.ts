import { TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { GetBooksGQL } from './get-books.gql';
import { Art, BuchEntity } from '../../entities';
import { GraphQLFormattedError } from 'graphql';

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
    const mockBooks: BuchEntity[] = [
      {
        id: 1,
        isbn: '1234567890',
        titel: { titel: 'Book 1', untertitel: 'Subtitle 1' },
        version: 0,
        rating: null,
        art: Art.EPUB,
        preis: 0,
        lieferbar: null,
        datum: null,
        homepage: null,
        schlagwoerter: null,
        rabatt: '',
      },
      {
        id: 2,
        isbn: '0987654321',
        titel: { titel: 'Book 2', untertitel: 'Subtitle 2' },
        version: 0,
        rating: null,
        art: Art.EPUB,
        preis: 0,
        lieferbar: null,
        datum: null,
        homepage: null,
        schlagwoerter: null,
        rabatt: '',
      },
    ];

    getBooksGQL
      .watch({
        suchkriterien: {
          titel: null,
          isbn: null,
          rating: null,
          art: null,
          lieferbar: null,
        },
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
