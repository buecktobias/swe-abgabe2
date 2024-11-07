/* eslint-disable @typescript-eslint/naming-convention */
export interface CreatePayload {
  id: number | null;
}

export interface UpdatePayload {
  version: number | null;
}

export interface TokenResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}
