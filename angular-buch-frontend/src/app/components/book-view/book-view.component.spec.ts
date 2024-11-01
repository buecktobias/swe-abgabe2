import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookViewComponent } from './book-view.component';
import { mockBooks } from '../../services/books/books.mock';

describe('BookViewComponent', () => {
  let component: BookViewComponent;
  let fixture: ComponentFixture<BookViewComponent>;
  const MOCK_BOOK = mockBooks[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookViewComponent);
    component = fixture.componentInstance;
    component.book = MOCK_BOOK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display book title and subtitle if available', () => {
    const titleElement = fixture.nativeElement.querySelector(
      '[data-test="book-title"]',
    );
    const subtitleElement = fixture.nativeElement.querySelector(
      '[data-test="book-subtitle"]',
    );
    expect(titleElement.textContent).toContain(MOCK_BOOK.titel.titel);
    expect(subtitleElement.textContent).toContain(MOCK_BOOK.titel.untertitel);
  });

  it('should display book ISBN, price, and discount', () => {
    const isbnElement = fixture.nativeElement.querySelector(
      '[data-test="book-isbn"]',
    );
    const priceElement = fixture.nativeElement.querySelector(
      '[data-test="book-price"]',
    );
    const discountElement = fixture.nativeElement.querySelector(
      '[data-test="book-discount"]',
    );
    expect(isbnElement.textContent).toContain(MOCK_BOOK.isbn);
    expect(priceElement.textContent).toContain(`€${MOCK_BOOK.preis}`);
    expect(discountElement.textContent).toContain(MOCK_BOOK.rabatt);
  });

  it('should display keywords list or fallback message', () => {
    const keywordsContainer = fixture.nativeElement.querySelector(
      '[data-test="book-keywords"]',
    );
    const keywordElements = fixture.nativeElement.querySelectorAll(
      '[data-test="book-keyword"]',
    );
    if (MOCK_BOOK.schlagwoerter && MOCK_BOOK.schlagwoerter.length > 0) {
      expect(keywordElements.length).toBe(MOCK_BOOK.schlagwoerter.length);
      MOCK_BOOK.schlagwoerter.forEach((keyword, index) => {
        expect(keywordElements[index].textContent).toContain(keyword);
      });
    } else {
      expect(keywordsContainer.textContent).toContain('No keywords available');
    }
  });

  it('should render book details sections conditionally', () => {
    const ratingElement = fixture.nativeElement.querySelector(
      '[data-test="book-rating"]',
    );
    const availabilityElement = fixture.nativeElement.querySelector(
      '[data-test="is-book-available"]',
    );
    const publicationDateElement = fixture.nativeElement.querySelector(
      '[data-test="book-publication-date"]',
    );
    const homepageLink = fixture.nativeElement.querySelector(
      '[data-test="book-homepage-link"]',
    );

    if (MOCK_BOOK.rating) {
      expect(ratingElement.textContent).toContain(MOCK_BOOK.rating);
    }
    if (MOCK_BOOK.lieferbar) {
      expect(availabilityElement.getAttribute('data-is-available')).toBe(
        MOCK_BOOK.lieferbar.toString(),
      );
    }
    if (MOCK_BOOK.datum) {
      expect(publicationDateElement.textContent).toContain(MOCK_BOOK.datum);
    }
    if (MOCK_BOOK.homepage) {
      expect(homepageLink.getAttribute('href')).toBe(MOCK_BOOK.homepage);
    }
  });
});
