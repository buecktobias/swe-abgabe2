import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { BookService } from './books/services/book.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

describe('AppComponent', () => {
  const bookServiceMock = {
    getBooks: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: BookService, useValue: bookServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
          },
        },
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: true,
            user: { username: 'testUser' },
            logout: jasmine.createSpy(),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
