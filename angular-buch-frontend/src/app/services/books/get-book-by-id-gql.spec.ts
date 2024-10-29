import { TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { GetBookByIdGQL } from './get-book-by-id.gql';
import { mockBooks } from './books.mock';
import { GraphQLFormattedError } from 'graphql/error/GraphQLError';

describe('GetBookByIdGQL', () => {
  let getBookByIdGQL: GetBookByIdGQL;
  let controller: ApolloTestingController;

  const mockBook = mockBooks[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [GetBookByIdGQL],
    });

    getBookByIdGQL = TestBed.inject(GetBookByIdGQL);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should fetch a book by ID successfully', (done) => {
    getBookByIdGQL
      .watch({ id: mockBook.id.toString() })
      .valueChanges.subscribe((result) => {
        expect(result.data.buch).toEqual(mockBook);
        done();
      });

    const op = controller.expectOne(getBookByIdGQL.document);
    expect(op.operation.variables['id']).toBe(mockBook.id.toString());
    op.flush({
      data: { buch: mockBook },
    });
  });

  it('should handle errors gracefully when fetching by ID', (done) => {
    getBookByIdGQL.watch({ id: 'invalid-id' }).valueChanges.subscribe({
      next: () => fail('Expected an error response'),
      error: (error) => {
        expect(error.message).toContain('Error fetching book');
        done();
      },
    });

    const op = controller.expectOne(getBookByIdGQL.document);
    op.graphqlErrors([
      {
        message: 'Error fetching book',
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
