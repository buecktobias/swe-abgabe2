export interface CreatePayload {
  id: number | null;
}

export interface UpdatePayload {
  version: number | null;
}

export interface TokenResult {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}
