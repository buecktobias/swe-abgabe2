import { Role } from './role.model';

export interface User {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly roles: Role[];
}
