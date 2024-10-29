import { TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { CreateBookGQL } from './create-book.gql';
import { BuchInput } from '../../graphql/inputs';
import { CreatePayload } from '../../graphql/payloads';
import { Art } from '../../graphql/entities';
import { GraphQLFormattedError } from 'graphql/error/GraphQLError';

describe('CreateBookGQL', () => {
  let createBookGQL: CreateBookGQL;
  let controller: ApolloTestingController;

  const mockInput: BuchInput = {
    isbn: '1234567890',
    rating: 4,
    art: Art.EPUB,
    preis: 15.99,
    rabatt: 5.0,
    lieferbar: true,
    datum: '2023-01-01',
    homepage: 'http://example.com',
    schlagwoerter: ['fiction', 'new release'],
    titel: {
      titel: 'Sample Book',
      untertitel: 'An Example Subtitle',
    },
    abbildungen: [],
  };

  const mockPayload: CreatePayload = {
    id: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [CreateBookGQL],
    });

    createBookGQL = TestBed.inject(CreateBookGQL);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create a book successfully', (done) => {
    createBookGQL.mutate({ input: mockInput }).subscribe((result) => {
      expect(result.data?.create).toEqual(mockPayload);
      done();
    });

    const op = controller.expectOne(createBookGQL.document);
    expect(op.operation.variables['input']).toEqual(mockInput);
    op.flush({
      data: { create: mockPayload },
    });
  });

  it('should handle errors gracefully when creation fails', (done) => {
    createBookGQL.mutate({ input: mockInput }).subscribe({
      next: () => fail('Expected an error response'),
      error: (error) => {
        expect(error.message).toContain('Failed to create book');
        done();
      },
    });

    const op = controller.expectOne(createBookGQL.document);
    op.graphqlErrors([
      {
        message: 'Failed to create book',
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
