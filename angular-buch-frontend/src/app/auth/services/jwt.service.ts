import { Injectable } from '@angular/core';
import { JwtPayload } from '../models/jwt-payload.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  encode(jwtPayload: JwtPayload): string {
    const base64JwtPayload = btoa(JSON.stringify(jwtPayload));
    return `header.${base64JwtPayload}.signature`;
  }

  decode(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }
}
