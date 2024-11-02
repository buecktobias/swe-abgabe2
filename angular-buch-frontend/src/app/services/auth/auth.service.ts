import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import jwtDecode from 'jwt-decode';

export interface TokenResult {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

export interface User {}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private tokenResult: TokenResult | null = null;

  login(tokenResult: TokenResult): void {
    this.tokenResult = tokenResult;
    localStorage.setItem('tokenResult', JSON.stringify(tokenResult));

    const decodedToken = this.decodeToken(tokenResult.accessToken);
    if (decodedToken) {
      this.currentUserSubject.next(decodedToken);
    }
  }

  logout(): void {
    this.tokenResult = null;
    this.currentUserSubject.next(null);
    localStorage.removeItem('tokenResult');
  }

  loadUserFromStorage(): void {
    const tokenResultJson = localStorage.getItem('tokenResult');
    if (tokenResultJson) {
      const storedTokenResult: TokenResult = JSON.parse(tokenResultJson);
      this.tokenResult = storedTokenResult;

      const decodedToken = this.decodeToken(storedTokenResult.accessToken);
      if (decodedToken) {
        this.currentUserSubject.next(decodedToken);
      }
    }
  }

  getCurrentUser(): DecodedToken | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenResult ? this.tokenResult.accessToken : null;
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode.jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
}
