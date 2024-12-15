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

/* eslint-disable no-underscore-dangle */

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type BuecherModel } from '../../src/buch/controller/buch-get.controller';
import {
    host,
    httpType,
    port,
} from '../testserver';
import { type ErrorResponse } from './error-response';

const titelVorhanden = 'a';
const titelNichtVorhanden = 'xx';
const schlagwortVorhanden = 'javascript';
const schlagwortNichtVorhanden = 'csharp';

describe('GET /rest', () => {
    let baseURL: string;
    let client: AxiosInstance;

    beforeAll(async () => {
        baseURL = `${httpType}://${host}:${port}/rest`;
        client = axios.create({
            baseURL,
            validateStatus: () => true,
        });
    });

    afterAll(async () => {
    });

    test('Alle Buecher', async () => {
        const { status, headers, data }: AxiosResponse<BuecherModel> =
            await client.get('/');

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu); // eslint-disable-line sonarjs/no-duplicate-string
        expect(data).toBeDefined();

        const { buecher } = data._embedded;

        buecher
            .map((buch) => buch._links.self.href)
            .forEach((selfLink) => {
                // eslint-disable-next-line security/detect-non-literal-regexp, security-node/non-literal-reg-expr
                expect(selfLink).toMatch(new RegExp(`^${baseURL}`, 'iu'));
            });
    });

    test('Buecher mit einem Teil-Titel suchen', async () => {
        const params = { titel: titelVorhanden };

        const { status, headers, data }: AxiosResponse<BuecherModel> =
            await client.get('/', { params });

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data).toBeDefined();

        const { buecher } = data._embedded;

        buecher
            .map((buch) => buch.titel)
            .forEach((titel) =>
                expect(titel.titel.toLowerCase()).toEqual(
                    expect.stringContaining(titelVorhanden),
                ),
            );
    });

    test('Buecher zu einem nicht vorhandenen Teil-Titel suchen', async () => {
        const params = { titel: titelNichtVorhanden };

        const { status, data }: AxiosResponse<ErrorResponse> = await client.get(
            '/',
            { params },
        );

        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, statusCode } = data;

        expect(error).toBe('Not Found');
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    test('Mind. 1 Buch mit vorhandenem Schlagwort', async () => {
        const params = { [schlagwortVorhanden]: 'true' };

        const { status, headers, data }: AxiosResponse<BuecherModel> =
            await client.get('/', { params });

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data).toBeDefined();

        const { buecher } = data._embedded;

        buecher
            .map((buch) => buch.schlagwoerter)
            .forEach((schlagwoerter) =>
                expect(schlagwoerter).toEqual(
                    expect.arrayContaining([schlagwortVorhanden.toUpperCase()]),
                ),
            );
    });

    test('Keine Buecher zu einem nicht vorhandenen Schlagwort', async () => {
        const params = { [schlagwortNichtVorhanden]: 'true' };

        const { status, data }: AxiosResponse<ErrorResponse> = await client.get(
            '/',
            { params },
        );

        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, statusCode } = data;

        expect(error).toBe('Not Found');
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    test('Keine Buecher zu einer nicht-vorhandenen Property', async () => {
        const params = { foo: 'bar' };

        const { status, data }: AxiosResponse<ErrorResponse> = await client.get(
            '/',
            { params },
        );

        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, statusCode } = data;

        expect(error).toBe('Not Found');
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });
});
/* eslint-enable no-underscore-dangle */
