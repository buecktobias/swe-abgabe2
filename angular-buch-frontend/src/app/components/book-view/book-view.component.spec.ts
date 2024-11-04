import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BookViewComponent } from './book-view.component';
import { mockBooks } from '../../services/books/books.mock';

describe('BookViewComponent', () => {
  let component: BookViewComponent;
  let fixture: ComponentFixture<BookViewComponent>;
  let debugElement: DebugElement;
  const mockedBook = mockBooks[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.book = mockedBook;
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

  it('should display book ISBN, price, and discount', () => {
    const isbnElement = debugElement.query(By.css('[data-test="book-isbn"]')).nativeElement as HTMLElement;
    const priceElement = debugElement.query(By.css('[data-test="book-price"]')).nativeElement as HTMLElement;
    const discountElement = debugElement.query(By.css('[data-test="book-discount"]')).nativeElement as HTMLElement;

    expect(isbnElement.textContent).toContain(mockedBook.isbn);
    expect(priceElement.textContent).toContain(mockedBook.preis);
    expect(discountElement.textContent).toContain(mockedBook.rabatt);
  });

  it('should display keywords list or fallback message', () => {
    const keywordsContainer = debugElement.query(By.css('[data-test="book-keywords"]')).nativeElement as HTMLElement;
    const keywordElements = debugElement.queryAll(By.css('[data-test="book-keyword"]'));

    if (mockedBook.schlagwoerter && mockedBook.schlagwoerter.length > 0) {
      expect(keywordElements.length).toBe(mockedBook.schlagwoerter.length);
      mockedBook.schlagwoerter.forEach((keyword, index) => {
        expect((keywordElements[index].nativeElement as HTMLElement).textContent).toContain(keyword);
      });
    } else {
      expect(keywordsContainer.textContent).toContain('No keywords available');
    }
  });

  it('should render book details sections conditionally', () => {
    const ratingElement = debugElement.query(By.css('[data-test="book-rating"]')).nativeElement as HTMLElement | null;
    const availabilityElement = debugElement.query(By.css('[data-test="is-book-available"]')).nativeElement as HTMLElement | null;
    const publicationDateElement = debugElement.query(By.css('[data-test="book-publication-date"]')).nativeElement as HTMLElement | null;
    const homepageLink = debugElement.query(By.css('[data-test="book-homepage-link"]')).nativeElement as HTMLAnchorElement | null;

    if (mockedBook.rating) {
      expect(ratingElement?.textContent).toContain(mockedBook.rating);
    }
    if (mockedBook.lieferbar !== null) {
      expect(availabilityElement?.getAttribute('data-is-available')).toBe(mockedBook.lieferbar.toString());
    }
    if (mockedBook.datum) {
      expect(publicationDateElement?.textContent).toContain(mockedBook.datum);
    }
    if (mockedBook.homepage) {
      expect(homepageLink?.getAttribute('href')).toBe(mockedBook.homepage);
    }
  });
});
