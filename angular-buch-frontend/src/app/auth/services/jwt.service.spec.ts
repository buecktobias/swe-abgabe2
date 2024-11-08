/* eslint-disable @typescript-eslint/naming-convention */
import { JwtService } from './jwt.service';
import { JwtPayload } from '../models/jwt-payload.model';
import { TestBed } from '@angular/core/testing';

describe('JwtService', () => {
  let jwtService: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtService],
    });

    jwtService = TestBed.inject(JwtService);
  });

  it('should be created', () => {
    expect(jwtService).toBeTruthy();
  });

  it('should encode and decode JWT', () => {
    const jwtPayload: JwtPayload = {
      preferred_username: 'admin',
      given_name: 'Admin',
      family_name: 'Nest',
      email: '',
      resource_access: {
        'nest-client': {
          roles: ['admin', 'user'],
        },
      },
    };
    const jwt = jwtService.encode(jwtPayload);
    expect(jwt).toMatch(/^.+\..+\..+$/);
    const decoded = jwtService.decode(jwt);
    expect(decoded).toEqual(jwtPayload);
  });
});
