import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEditComponent } from './book-edit.component';
import { BookService } from '../../books/services/book.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ENV_CONFIG, LogLevel } from '../../../environments/environment.config';

class MockedAuthService {
  hasUserAccess = () => true;
  hasAdminAccess = () => true;
}

describe('BookEditComponent', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookEditComponent],
      providers: [
        BookService,
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        {
          provide: BookService,
          useValue: { getBookById: () => null },
        },
        { provide: AuthService, useClass: MockedAuthService },
        { provide: ENV_CONFIG, useValue: { logLevel: LogLevel.DEBUG } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
