import { Role } from './role.model';
import { JWTPayload } from './jwt-payload.model';

export class User {
  constructor(
    readonly username: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly roles: Set<Role>,
  ) {}

  static fromJWTPayload(jwtPayload: JWTPayload): User {
    return new User(
      jwtPayload.preferred_username,
      jwtPayload.given_name,
      jwtPayload.family_name,
      jwtPayload.email,
      new Set(jwtPayload.resource_access['nest-client'].roles as Role[]),
    );
  }
}
