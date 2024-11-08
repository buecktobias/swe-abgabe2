import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [AuthService, TokenService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
