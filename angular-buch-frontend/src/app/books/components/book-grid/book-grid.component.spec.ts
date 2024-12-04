import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGridComponent } from './book-grid.component';
import { BookService } from '../../services/book.service';
import { of } from 'rxjs';
import { mockBooks } from '../../mocks/books.mock';
import { ActivatedRoute } from '@angular/router';

describe('BookGridComponent', () => {
  let component: BookGridComponent;
  let fixture: ComponentFixture<BookGridComponent>;
  const bookServiceMock = {
    getAllBooks: () => of(mockBooks),
    getBooksBy: () => of(mockBooks),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookGridComponent],
      providers: [
        { provide: BookService, useValue: bookServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
