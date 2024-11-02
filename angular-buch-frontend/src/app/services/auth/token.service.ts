import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiryTime: number | null = null;

  constructor(private http: HttpClient) {}

  initializeTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('token_expiry', this.tokenExpiryTime.toString());
  }

  getAccessToken(): string | null {
    if (this.isAccessTokenExpired() && this.refreshToken) {
      this.refreshTokens();
    }
    return this.accessToken;
  }

  refreshTokens(): Observable<any> {
    return this.http.post('/auth/refresh', { refresh_token: this.refreshToken }).pipe(
      tap((response: any) => {
        this.initializeTokens(response.access_token, response.refresh_token, response.expires_in);
      }),
    );
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.clear();
  }

  private isAccessTokenExpired(): boolean {
    return Date.now() > (this.tokenExpiryTime || 0);
  }
}
