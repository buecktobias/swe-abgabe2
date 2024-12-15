import { Injectable } from '@nestjs/common';
import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type RawAxiosRequestHeaders,
} from 'axios';
import {
    type KeycloakConnectOptions,
    type KeycloakConnectOptionsFactory,
} from 'nest-keycloak-connect';
import { keycloakConnectOptions, paths } from '../../config/keycloak.js';
import { getLogger } from '../../logger/logger.js';
import * as fs from 'node:fs';

const { authServerUrl, clientId } = keycloakConnectOptions;

export type TokenData = {
    readonly username: string | undefined;
    readonly password: string | undefined;
};

@Injectable()
export class KeycloakService implements KeycloakConnectOptionsFactory {
    readonly #keycloakSecret: string;
    readonly #headers: RawAxiosRequestHeaders;
    readonly #headersAuthorization: RawAxiosRequestHeaders;

    readonly #keycloakClient: AxiosInstance;

    readonly #logger = getLogger(KeycloakService.name);
    readonly #keycloakConnectOptions: KeycloakConnectOptions;
    constructor() {
        this.#keycloakSecret = fs.readFileSync('/secrets/client_secret.txt', 'utf8');
        this.#headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const encoded = btoa(`${clientId}:${this.#keycloakSecret}`);
        this.#headersAuthorization = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encoded}`,
        };

        this.#keycloakClient = axios.create({
            baseURL: authServerUrl!,
        });
        this.#logger.debug('keycloakClient=%o', this.#keycloakClient.defaults);
        this.#keycloakConnectOptions = {
            ...keycloakConnectOptions,
            secret: this.#keycloakSecret,
        }

    }

    createKeycloakConnectOptions(): KeycloakConnectOptions {
        return this.#keycloakConnectOptions;
    }

    async token({ username, password }: TokenData) {
        this.#logger.debug('token: username=%s', username);
        if (username === undefined || password === undefined) {
            return;
        }
        this.#logger.debug('secret=%s', this.#keycloakSecret);
        const body = `username=${username}&password=${password}&grant_type=password&client_id=${clientId}&client_secret=${this.#keycloakSecret}`;
        let response: AxiosResponse<Record<string, number | string>>;
        try {
            response = await this.#keycloakClient.post(
                paths.accessToken,
                body,
                { headers: this.#headers },
            );
        } catch(error: any) {
            this.#logger.warn('token: Fehler bei %s', paths.accessToken);
            this.#logger.warn(error.response.data);
            return;
        }

        this.#logPayload(response);
        this.#logger.debug('token: response.data=%o', response.data);
        return response.data;
    }

    async refresh(refresh_token: string | undefined) {
        this.#logger.debug('refresh: refresh_token=%s', refresh_token);
        if (refresh_token === undefined) {
            return;
        }

        const body = `refresh_token=${refresh_token}&grant_type=refresh_token`;
        let response: AxiosResponse<Record<string, number | string>>;
        try {
            response = await this.#keycloakClient.post(
                paths.accessToken,
                body,
                { headers: this.#headersAuthorization },
                // { headers: this.#headersBasic },
            );
        } catch (err) {
            this.#logger.warn('err=%o', err);
            this.#logger.warn(
                'refresh: Fehler bei POST-Request: path=%s, body=%o',
                paths.accessToken,
                body,
            );
            return;
        }
        this.#logger.debug('refresh: response.data=%o', response.data);
        return response.data;
    }

    #logPayload(response: AxiosResponse<Record<string, string | number>>) {
        const { access_token } = response.data;
        const [, payloadStr] = (access_token as string).split('.');

        // Base64 decodieren
        if (payloadStr === undefined) {
            return;
        }
        const payloadDecoded = atob(payloadStr);

        const payload = JSON.parse(payloadDecoded);
        const { azp, exp, resource_access } = payload;
        this.#logger.debug('#logPayload: exp=%s', exp);
        const { roles } = resource_access[azp]; // eslint-disable-line security/detect-object-injection
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */

        this.#logger.debug('#logPayload: roles=%o', roles);
    }
}
