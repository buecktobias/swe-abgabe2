import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailViewComponent } from './book-detail-view.component';
import { mockBooks } from '../../books/mocks/books.mock';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BookService } from '../../books/services/book.service';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';

class MockedAuthService {
  hasUserAccess = () => true;
  hasAdminAccess = () => true;
}

describe('BookDetailViewComponent', () => {
  let component: BookDetailViewComponent;
  let fixture: ComponentFixture<BookDetailViewComponent>;
  let debugElement: DebugElement;
  const mockedBook = mockBooks[0];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailViewComponent],
      providers: [
        { provide: BookService, useValue: { getBookById: () => mockedBook } },
        {
          provide: AuthService,
          useClass: MockedAuthService,
        },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailViewComponent);
    component = fixture.componentInstance;
    component.book = mockedBook;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display book title and subtitle if available', () => {
    const titleElement = debugElement.query(By.css('[data-test="book-title"]')).nativeElement as HTMLElement;
    const subtitleElement = debugElement.query(By.css('[data-test="book-subtitle"]')).nativeElement as HTMLElement;

    expect(titleElement.textContent).toContain(mockedBook.titel.titel);
    expect(subtitleElement.textContent).toContain(mockedBook.titel.untertitel);
  });

  it('should display book price, and discount', () => {
    const priceElement = debugElement.query(By.css('[data-test="book-price"]')).nativeElement as HTMLElement;

    expect(priceElement.textContent).toContain(mockedBook.preis);
  });

  it('should display keywords list or fallback message', () => {
    const keywordElements = debugElement.queryAll(By.css('[data-test="book-keyword"]'));

    if (mockedBook.schlagwoerter && mockedBook.schlagwoerter.length > 0) {
      expect(keywordElements.length).toBe(mockedBook.schlagwoerter.length);
      mockedBook.schlagwoerter.forEach((keyword, index) => {
        expect((keywordElements[index].nativeElement as HTMLElement).textContent).toContain(keyword);
      });
    }
  });
});
