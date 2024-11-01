import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookViewByIdComponent } from './book-view-by-id.component';

describe('BookViewByIdComponent', () => {
  let component: BookViewByIdComponent;
  let fixture: ComponentFixture<BookViewByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookViewByIdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookViewByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
