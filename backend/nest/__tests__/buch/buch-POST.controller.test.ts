import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type BuchDTO } from '../../src/buch/controller/buchDTO.entity';
import { BuchReadService } from '../../src/buch/service/buch-read.service';
import {
    host,
    httpType,
    port,
} from '../testserver';
import { tokenRest } from '../token';
import { type ErrorResponse } from './error-response';

const neuesBuch: BuchDTO = {
    isbn: '978-0-007-00644-1',
    rating: 1,
    art: 'EPUB',
    preis: 99.99,
    rabatt: 0.123,
    lieferbar: true,
    datum: '2022-02-28',
    homepage: 'https://post.rest',
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
    titel: {
        titel: 'Titelpost',
        untertitel: 'untertitelpos',
    },
    abbildungen: [
        {
            beschriftung: 'Abb. 1',
            contentType: 'img/png',
        },
    ],
};
const neuesBuchInvalid: Record<string, unknown> = {
    isbn: 'falsche-ISBN',
    rating: -1,
    art: 'UNSICHTBAR',
    preis: -1,
    rabatt: 2,
    lieferbar: true,
    datum: '12345-123-123',
    homepage: 'anyHomepage',
    titel: {
        titel: '?!',
        untertitel: 'Untertitelinvalid',
    },
};
const neuesBuchIsbnExistiert: BuchDTO = {
    isbn: '978-3-897-22583-1',
    rating: 1,
    art: 'EPUB',
    preis: 99.99,
    rabatt: 0.099,
    lieferbar: true,
    datum: '2022-02-28',
    homepage: 'https://post.isbn/',
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
    titel: {
        titel: 'Titelpostisbn',
        untertitel: 'Untertitelpostisbn',
    },
    abbildungen: undefined,
};

describe('POST /rest', () => {
    let client: AxiosInstance;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json', // eslint-disable-line @typescript-eslint/naming-convention
    };

    beforeAll(async () => {
        const baseURL = `${httpType}://${host}:${port}`;
        client = axios.create({
            baseURL,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
    });

    test('Neues Buch', async () => {
        const token = await tokenRest(client);
        headers.Authorization = `Bearer ${token}`;

        const response: AxiosResponse<string> = await client.post(
            '/rest',
            neuesBuch,
            { headers },
        );

        const { status, data } = response;

        expect(status).toBe(HttpStatus.CREATED);

        const { location } = response.headers as { location: string };

        expect(location).toBeDefined();

        const indexLastSlash: number = location.lastIndexOf('/');

        expect(indexLastSlash).not.toBe(-1);

        const idStr = location.slice(indexLastSlash + 1);

        expect(idStr).toBeDefined();
        expect(BuchReadService.ID_PATTERN.test(idStr)).toBe(true);

        expect(data).toBe('');
    });

    test('Neues Buch mit ungueltigen Daten', async () => {
        const token = await tokenRest(client);
        headers.Authorization = `Bearer ${token}`;
        const expectedMsg = [
            expect.stringMatching(/^isbn /u),
            expect.stringMatching(/^rating /u),
            expect.stringMatching(/^art /u),
            expect.stringMatching(/^preis /u),
            expect.stringMatching(/^rabatt /u),
            expect.stringMatching(/^datum /u),
            expect.stringMatching(/^homepage /u),
            expect.stringMatching(/^titel.titel /u),
        ];

        const response: AxiosResponse<Record<string, any>> = await client.post(
            '/rest',
            neuesBuchInvalid,
            { headers },
        );

        const { status, data } = response;

        expect(status).toBe(HttpStatus.BAD_REQUEST);

        const messages: string[] = data.message;

        expect(messages).toBeDefined();
        expect(messages).toHaveLength(expectedMsg.length);
        expect(messages).toEqual(expect.arrayContaining(expectedMsg));
    });

    test('Neues Buch, aber die ISBN existiert bereits', async () => {
        const token = await tokenRest(client);
        headers.Authorization = `Bearer ${token}`;

        const response: AxiosResponse<ErrorResponse> = await client.post(
            '/rest',
            neuesBuchIsbnExistiert,
            { headers },
        );

        const { data } = response;

        const { message, statusCode } = data;

        expect(message).toEqual(expect.stringContaining('ISBN'));
        expect(statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    test('Neues Buch, aber ohne Token', async () => {
        const response: AxiosResponse<Record<string, any>> = await client.post(
            '/rest',
            neuesBuch,
        );

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test('Neues Buch, aber mit falschem Token', async () => {
        const token = 'FALSCH';
        headers.Authorization = `Bearer ${token}`;

        const response: AxiosResponse<Record<string, any>> = await client.post(
            '/rest',
            neuesBuch,
            { headers },
        );

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

});
