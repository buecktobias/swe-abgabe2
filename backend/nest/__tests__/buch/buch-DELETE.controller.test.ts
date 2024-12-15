// Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    host, httpType,
    port,
} from '../testserver';
import { tokenRest } from '../token';

const id = '50';

describe('DELETE /rest/buecher', () => {
    let client: AxiosInstance;

    beforeAll(async () => {
        const baseURL = `${httpType}://${host}:${port}`;
        client = axios.create({
            baseURL,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
    });

    test('Vorhandenes Buch loeschen', async () => {
        const url = `/rest/${id}`;
        const token = await tokenRest(client);
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`, // eslint-disable-line @typescript-eslint/naming-convention
        };

        const { status, data }: AxiosResponse<string> = await client.delete(
            url,
            { headers },
        );

        expect(status).toBe(HttpStatus.NO_CONTENT);
        expect(data).toBeDefined();
    });

    test('Buch loeschen, aber ohne Token', async () => {
        const url = `/rest/${id}`;

        const response: AxiosResponse<Record<string, any>> =
            await client.delete(url);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test('Buch loeschen, aber mit falschem Token', async () => {
        const url = `/rest/${id}`;
        const token = 'FALSCH';
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
        };

        const response: AxiosResponse<Record<string, any>> =
            await client.delete(url, { headers });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test('Vorhandenes Buch als "user" loeschen', async () => {
        const url = `/rest/60`;
        const token = await tokenRest(client, 'user', 'p');
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`, // eslint-disable-line @typescript-eslint/naming-convention
        };

        const response: AxiosResponse<string> = await client.delete(url, {
            headers,
        });

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
});
