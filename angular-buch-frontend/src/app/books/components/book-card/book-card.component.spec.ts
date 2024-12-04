import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BookCardComponent } from './book-card.component';
import { mockBooks } from '../../mocks/books.mock';
import { ActivatedRoute } from '@angular/router';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;
  let debugElement: DebugElement;
  const mockedBook = mockBooks[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
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

    expect(titleElement.textContent).toContain(mockedBook.titel.titel);
  });
});
