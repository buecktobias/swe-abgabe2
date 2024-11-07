import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  isValidLogin(username: string, password: string): void {
    this.tokenService.login(username, password);
  }
}
