import { Injectable } from '@angular/core';
import { JWTPayload } from '../models/jwt-payload.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  encode(jwtPayload: JWTPayload): string {
    const base64JwtPayload = btoa(JSON.stringify(jwtPayload));
    return `header.${base64JwtPayload}.signature`;
  }

  decode(token: string): JWTPayload {
    return jwtDecode<JWTPayload>(token);
  }
}
