export class CreatePayload {
  constructor(public id: number | null) {}
}

export class UpdatePayload {
  constructor(public version: number | null) {}
}

export class TokenResult {
  constructor(
    public accessToken: string,
    public expiresIn: number,
    public refreshToken: string,
    public refreshExpiresIn: number,
  ) {}
}
