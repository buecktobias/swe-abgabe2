import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { UpdateBookGQL } from './update-book.gql';
import { UpdatePayload } from '../../../auth/models/payloads.model';
import { BuchUpdateInput } from '../../models/buch.model';
import { ApolloError } from '@apollo/client/errors';
import { createGraphQLError } from '../../../shared/test-helpers';

describe('UpdateBookGQL', () => {
  let updateBookGQL: UpdateBookGQL;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [UpdateBookGQL],
    });

    updateBookGQL = TestBed.inject(UpdateBookGQL);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(updateBookGQL).toBeTruthy();
  });

  it('should execute update book mutation and return update payload', (done) => {
    const mockResponse: { update: UpdatePayload } = {
      update: {
        version: 2,
      },
    };

    const input: BuchUpdateInput = {
      id: 1,
      version: null,
      rabatt: null,
      isbn: null,
      rating: null,
      art: null,
      preis: null,
      lieferbar: null,
      datum: null,
      homepage: null,
      schlagwoerter: null,
    };

    updateBookGQL.mutate({ input }).subscribe((result) => {
      expect(result.data?.update).toEqual(mockResponse.update);
      done();
    });

    const op = controller.expectOne(updateBookGQL.document);

    expect(op.operation.variables).toEqual({ input });
    op.flush({
      data: mockResponse,
    });
  });

  it('should handle error response from update book mutation', (done) => {
    const input: BuchUpdateInput = {
      id: 1,
      homepage: 'http://example.com',
      version: null,
      rabatt: null,
      isbn: null,
      rating: null,
      art: null,
      preis: null,
      lieferbar: null,
      datum: null,
      schlagwoerter: null,
    };

    updateBookGQL.mutate({ input }).subscribe({
      next: () => {
        fail('Expected error, but got success');
      },
      error: (error: ApolloError) => {
        expect(error).toBeTruthy();
        expect(error.graphQLErrors[0].message).toBe('Update failed');
        done();
      },
    });

    const op = controller.expectOne(updateBookGQL.document);

    op.graphqlErrors([createGraphQLError('Update failed')]);
  });
});
