import { TestBed } from '@angular/core/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { DeleteBookGQL } from './delete-book.gql';
import { GraphQLFormattedError } from 'graphql/error/GraphQLError';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';

loadDevMessages();
loadErrorMessages();
describe('DeleteBookGQL', () => {
  let deleteBookGQL: DeleteBookGQL;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [DeleteBookGQL],
    });

    deleteBookGQL = TestBed.inject(DeleteBookGQL);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should delete a book successfully', (done) => {
    deleteBookGQL.mutate({ id: '1' }).subscribe((result) => {
      expect(result.data?.delete).toBe(true);
      done();
    });
    const op = controller.expectOne(deleteBookGQL.document);
    expect(op.operation.variables['id']).toBe('1');
    op.flush({
      data: { delete: true },
    });
  });

  it('should handle errors gracefully when deletion fails', (done) => {
    deleteBookGQL.mutate({ id: 'invalid-id' }).subscribe({
      next: () => fail('Expected an error response'),
      error: (error) => {
        expect(error.message).toContain('Failed to delete book');
        done();
      },
    });

    const op = controller.expectOne(deleteBookGQL.document);
    op.graphqlErrors([
      {
        message: 'Failed to delete book',
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
