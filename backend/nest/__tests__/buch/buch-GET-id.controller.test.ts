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
import { type BuchModel } from '../../src/buch/controller/buch-get.controller';
import {
    host,
    httpType,
    port,
} from '../testserver';
import { type ErrorResponse } from './error-response';
const idVorhanden = '1';
const idNichtVorhanden = '999999';
const idVorhandenETag = '1';
const idFalsch = 'xy';

// eslint-disable-next-line max-lines-per-function
describe('GET /rest/:id', () => {
    let client: AxiosInstance;

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        const baseURL = `${httpType}://${host}:${port}/rest`;
        client = axios.create({
            baseURL,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
    });

    test('Buch zu vorhandener ID', async () => {
        const url = `/${idVorhanden}`;

        const { status, headers, data }: AxiosResponse<BuchModel> =
            await client.get(url);

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);

        const selfLink = data._links.self.href;

        expect(selfLink).toMatch(new RegExp(`${url}$`, 'u'));
    });

    test('Kein Buch zu nicht-vorhandener ID', async () => {
        const url = `/${idNichtVorhanden}`;

        const { status, data }: AxiosResponse<ErrorResponse> =
            await client.get(url);

        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, message, statusCode } = data;

        expect(error).toBe('Not Found');
        expect(message).toEqual(expect.stringContaining(message));
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    test('Kein Buch zu falscher ID', async () => {
        const url = `/${idFalsch}`;

        const { status, data }: AxiosResponse<ErrorResponse> =
            await client.get(url);

        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, statusCode } = data;

        expect(error).toBe('Not Found');
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    test('Buch zu vorhandener ID mit ETag', async () => {
        const url = `/${idVorhandenETag}`;

        const { status, data }: AxiosResponse<string> = await client.get(url, {
            headers: { 'If-None-Match': '"0"' }, // eslint-disable-line @typescript-eslint/naming-convention
        });

        expect(status).toBe(HttpStatus.NOT_MODIFIED);
        expect(data).toBe('');
    });
});
