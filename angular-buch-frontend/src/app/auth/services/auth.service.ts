import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { SessionTokens } from '../models/session-tokens.model';
import { User } from '../models/user.model';
import { UserLoginInformation } from '../models/user-login-information.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionTokens: SessionTokens | null = null;
  private readonly currentUser: User | null = null;

  constructor(private readonly tokenService: TokenService) {}

  get user(): User | null {
    return this.currentUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(userLoginInformation: UserLoginInformation): void {
    this.tokenService;
  }

  logout(): void {
    throw new Error('Method not implemented.');
  }

  isValidLogin(userLoginInformation: UserLoginInformation): void {
    this.tokenService.login(userLoginInformation);
  }
}
