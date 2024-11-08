/* eslint-disable @typescript-eslint/naming-convention */
export interface JwtPayload {
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  resource_access: {
    'nest-client': {
      roles: string[];
    };
  };
}
