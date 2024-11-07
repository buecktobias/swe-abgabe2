import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { GetBooksGQL } from '../graphql/queries/get-books.gql';
import { mockBooks } from '../mocks/books.mock';
import { Art } from '../models/art.model';

describe('BookService', () => {
  let service: BookService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [GetBooksGQL, BookService],
    });

    service = TestBed.inject(BookService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all books successfully', (done) => {
    service.getAllBooks().subscribe((result) => {
      expect(result.data.buecher).toEqual(mockBooks);
      done();
    });

    const op = controller.expectOne(TestBed.inject(GetBooksGQL).document);
    op.flush({
      data: {
        buecher: mockBooks,
      },
    });
  });

  it('should fetch books based on criteria', (done) => {
    const searchCriteria = {
      titel: 'Mock Book 1',
      isbn: '1234567890',
      rating: 5,
      art: Art.EPUB,
      lieferbar: true,
    };

    service.getBooksBy(searchCriteria).subscribe((result) => {
      expect(result.data.buecher).toEqual([mockBooks[0]]);
      done();
    });

    const op = controller.expectOne(TestBed.inject(GetBooksGQL).document);
    op.flush({
      data: {
        buecher: [mockBooks[0]],
      },
    });
  });
});
