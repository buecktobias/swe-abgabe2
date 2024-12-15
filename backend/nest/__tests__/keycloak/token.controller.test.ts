import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    host, httpType,
    port,
    refreshPath,
    tokenPath,
} from '../testserver';
const username = 'admin';
const password = 'p';
const passwordFalsch = 'FALSCHES_PASSWORT !!!';

describe('REST-Schnittstelle /token', () => {
    let client: AxiosInstance;

    beforeAll(async () => {
        const baseURL = `${httpType}://${host}:${port}/`;
        client = axios.create({
            baseURL,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
    });

    test('Token mit korrektem Passwort', async () => {
        const body = `username=${username}&password=${password}`;

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { status, data }: AxiosResponse<{ access_token: string }> =
            await client.post(tokenPath, body);

        expect(status).toBe(HttpStatus.OK);

        const { access_token } = data; // eslint-disable-line camelcase, @typescript-eslint/naming-convention
        const tokenParts = access_token.split('.'); // eslint-disable-line camelcase

        expect(tokenParts).toHaveLength(3); // eslint-disable-line @typescript-eslint/no-magic-numbers
        expect(access_token).toMatch(/^[a-z\d]+\.[a-z\d]+\.[\w-]+$/iu);
    });

    test('Token mit falschem Passwort', async () => {
        const body = `username=${username}&password=${passwordFalsch}`;

        const response: AxiosResponse<Record<string, any>> = await client.post(
            tokenPath,
            body,
        );

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test('Token ohne Benutzerkennung', async () => {
        const body = '';

        const response: AxiosResponse<Record<string, any>> = await client.post(
            tokenPath,
            body,
        );

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test('Refresh', async () => {
        const tokenBody = `username=${username}&password=${password}`;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const tokenResponse: AxiosResponse<{ refresh_token: string }> =
            await client.post(tokenPath, tokenBody);
        const { refresh_token } = tokenResponse.data; // eslint-disable-line camelcase, @typescript-eslint/naming-convention
        const body = `refresh_token=${refresh_token}`; // eslint-disable-line camelcase

        const { status, data }: AxiosResponse<{ access_token: string }> =
            await client.post(refreshPath, body);

        expect(status).toBe(HttpStatus.OK);

        const { access_token } = data; // eslint-disable-line camelcase, @typescript-eslint/naming-convention
        const tokenParts = access_token.split('.'); // eslint-disable-line camelcase

        expect(tokenParts).toHaveLength(3); // eslint-disable-line @typescript-eslint/no-magic-numbers
        expect(access_token).toMatch(/^[a-z\d]+\.[a-z\d]+\.[\w-]+$/iu);
    });
});
