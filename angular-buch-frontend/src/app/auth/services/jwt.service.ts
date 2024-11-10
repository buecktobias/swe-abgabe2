import { Injectable } from '@angular/core';
import { JWTPayload } from '../models/jwt-payload.model';
import { jwtDecode } from 'jwt-decode';
import { Logger } from '../../shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private readonly logger: Logger) {}
  encode(jwtPayload: JWTPayload): string {
    this.logger.debug('Only use JwtService.encode for testing purposes!');
    const base64JwtPayload = btoa(JSON.stringify(jwtPayload));
    return `header.${base64JwtPayload}.signature`;
  }

  decode(token: string): JWTPayload {
    return jwtDecode<JWTPayload>(token);
  }
}
