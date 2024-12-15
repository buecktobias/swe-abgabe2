/**
 * Das Modul besteht aus der Controller-Klasse für die Authentifizierung an der
 * REST-Schnittstelle.
 * @packageDocumentation
 */

// eslint-disable-next-line max-classes-per-file
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiConsumes,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'nest-keycloak-connect';
import { paths } from '../../config/paths.js';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { KeycloakService } from './keycloak.service.js';

/** Entity-Klasse für Token-Daten. */
export class TokenData {
    /** Benutzername */
    @ApiProperty({ example: 'admin', type: String })
    username: string | undefined;

    /** Passwort */
    @ApiProperty({ example: 'p', type: String })
    password: string | undefined;
}

/** Entity-Klasse für Refresh-Token. */
export class Refresh {
    /** Refresh Token */
    @ApiProperty({ example: 'alg.payload.signature', type: String })
    refresh_token: string | undefined; // eslint-disable-line @typescript-eslint/naming-convention, camelcase
}

/**
 * Die Controller-Klasse für die Authentifizierung mit Tokens.
 */
@Controller(paths.auth)
@UseInterceptors(ResponseTimeInterceptor)
@ApiTags('Authentifizierung und Autorisierung')
export class TokenController {
    readonly #keycloakService: KeycloakService;

    readonly #logger = getLogger(TokenController.name);

    constructor(keycloakService: KeycloakService) {
        this.#keycloakService = keycloakService;
    }

    /**
     * Token zu username und password im Request-Body und Content-Type
     * application/x-www-form-urlencoded oder application/json.
     *
     * @param body Request-Body von Express mit username und password.
     * @param res Leeres Response-Objekt von Express.
     * @returns Response mit Body aus access_token, expires_in,
     *  refresh_token und refresh_expires_in sowie Statuscode 200, falls der
     *  Request erfolgreich war. Sonst Statuscode 401.
     */
    @Post(paths.token)
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
    @ApiOperation({ summary: 'Access Token zu Benutzername und Passwort' })
    @ApiOkResponse({ description: 'Erfolgreich eingeloggt.' })
    @ApiUnauthorizedResponse({
        description: 'Benutzername oder Passwort sind falsch.',
    })
    async token(
        @Body() { username, password }: TokenData,
        @Res() res: Response,
    ) {
        this.#logger.debug('token: username=%s', username);

        const result = await this.#keycloakService.token({
            username,
            password,
        });
        if (result === undefined) {
            return res.sendStatus(HttpStatus.UNAUTHORIZED);
        }

        return res.json(result).send();
    }

    @Post(paths.refresh)
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
    @ApiOperation({ summary: 'Refresh für vorhandenen Token' })
    @ApiOkResponse({ description: 'Erfolgreich aktualisiert.' })
    @ApiUnauthorizedResponse({ description: 'Ungültiger Token.' })
    async refresh(@Body() body: Refresh, @Res() res: Response) {
        // eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
        const { refresh_token } = body;
        this.#logger.debug('refresh: refresh_token=%s', refresh_token);

        const result = await this.#keycloakService.refresh(refresh_token);
        if (result === undefined) {
            return res.sendStatus(HttpStatus.UNAUTHORIZED);
        }

        return res.json(result).send();
    }
}
