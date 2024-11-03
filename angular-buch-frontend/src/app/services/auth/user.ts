import { Role } from './role.model';

export class User {
  constructor(
    public readonly username: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly roles: Role[],
  ) {}

  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }
}
