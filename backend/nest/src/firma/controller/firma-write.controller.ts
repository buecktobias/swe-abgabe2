/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable max-params */
import {
    Body,
    Controller,
    Delete,
    Headers,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiNoContentResponse,
    ApiOperation,
    ApiPreconditionFailedResponse,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { paths } from '../../config/paths.js';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { Beschreibung } from '../entity/beschreibung.entity.js';
import { type Firma } from '../entity/firma.entity.js';
import { Standort } from '../entity/standort.entity.js';
import { FirmaWriteService } from '../service/firma-write.service.js';
import { FirmaDTO, FirmaDtoOhneRef } from './firmaDTO.entity.js';
import { getBaseUri } from './getBaseUri.js';

const MSG_FORBIDDEN = 'Kein Token mit ausreichender Berechtigung vorhanden';

@Controller(paths.rest)
@UseGuards(AuthGuard)
@UseInterceptors(ResponseTimeInterceptor)
@ApiTags('Firma REST-API')
@ApiBearerAuth()
export class FirmaWriteController {
    readonly #service: FirmaWriteService;

    readonly #logger = getLogger(FirmaWriteController.name);

    constructor(service: FirmaWriteService) {
        this.#service = service;
    }

    @Post()
    @Roles({ roles: ['admin', 'user'] })
    @ApiOperation({ summary: 'Ein neues Unternehmen anlegen' })
    @ApiCreatedResponse({ description: 'Erfolgreich neu angelegt' })
    @ApiBadRequestResponse({ description: 'Fehlerhafte Firmendaten' })
    @ApiForbiddenResponse({ description: MSG_FORBIDDEN })
    async post(
        @Body() firmaDTO: FirmaDTO,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        this.#logger.debug('post: firmaDTO=%o', firmaDTO);

        const firma = this.#firmaDtoToFirma(firmaDTO);
        const id = await this.#service.create(firma);

        const location = `${getBaseUri(req)}/${id}`;
        this.#logger.debug('post: location=%s', location);
        return res.location(location).send();
    }

    @Put(':id')
    @Roles({ roles: ['admin', 'user'] })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Ein vorhandenes Unternehmen aktualisieren',
        tags: ['Aktualisieren'],
    })
    @ApiHeader({
        name: 'If-Match',
        description: 'Header für optimistische Synchronisation',
        required: false,
    })
    @ApiNoContentResponse({ description: 'Erfolgreich aktualisiert' })
    @ApiBadRequestResponse({ description: 'Fehlerhafte Firmendaten' })
    @ApiPreconditionFailedResponse({
        description: 'Falsche Version im Header "If-Match"',
    })
    @ApiResponse({
        status: HttpStatus.PRECONDITION_REQUIRED,
        description: 'Header "If-Match" fehlt',
    })
    @ApiForbiddenResponse({ description: MSG_FORBIDDEN })
    async put(
        @Body() firmaDTO: FirmaDtoOhneRef,
        @Param('id') id: number,
        @Headers('If-Match') version: string | undefined,
        @Res() res: Response,
    ): Promise<Response> {
        this.#logger.debug(
            'put: id=%s, firmaDTO=%o, version=%s',
            id,
            firmaDTO,
            version,
        );

        if (version === undefined) {
            const msg = 'Header "If-Match" fehlt';
            this.#logger.debug('put: msg=%s', msg);
            return res
                .status(HttpStatus.PRECONDITION_REQUIRED)
                .set('Content-Type', 'application/json')
                .send(msg);
        }

        const firma = this.#firmaDtoOhneRefToFirma(firmaDTO);
        const neueVersion = await this.#service.update({ id, firma, version });
        this.#logger.debug('put: version=%d', neueVersion);
        return res.header('ETag', `"${neueVersion}"`).send();
    }

    @Delete(':id')
    @Roles({ roles: ['admin'] })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Unternehmen mit der ID löschen' })
    @ApiNoContentResponse({
        description: 'Das Unternehmen wurde gelöscht oder war nicht vorhanden',
    })
    @ApiForbiddenResponse({ description: MSG_FORBIDDEN })
    async delete(@Param('id') id: number) {
        this.#logger.debug('delete: id=%s', id);
        await this.#service.delete(id);
    }

    #firmaDtoToFirma(firmaDTO: FirmaDTO): Firma {
        const beschreibungDTO = firmaDTO.beschreibung;
        const beschreibung: Beschreibung = {
            id: undefined,
            slogan: beschreibungDTO.slogan,
            mission: beschreibungDTO.mission,
            firma: undefined,
        };

        const standorte = firmaDTO.standorte?.map((standortDTO) => {
            const standort: Standort = {
                id: undefined,
                adresse: standortDTO.adresse,
                land: standortDTO.land,
                stadt: standortDTO.stadt,
                firma: undefined,
            };
            return standort;
        });

        const firma = {
            id: undefined,
            version: undefined,
            name: firmaDTO.name,
            branche: firmaDTO.branche,
            umsatz: firmaDTO.umsatz,
            mitarbeiterzahl: firmaDTO.mitarbeiterzahl,
            aktiv: firmaDTO.aktiv,
            gruendungsdatum: firmaDTO.gruendungsdatum,
            website: firmaDTO.website,
            schlagwoerter: firmaDTO.schlagwoerter,
            beschreibung,
            standorte,
            erzeugt: new Date(),
            aktualisiert: new Date(),
        };
        // Rueckwaertsverweise
        firma.beschreibung.firma = firma;
        firma.standorte?.forEach((standort) => {
            standort.firma = firma;
        });
        return firma;
    }

    #firmaDtoOhneRefToFirma(firmaDTO: FirmaDtoOhneRef): Firma {
        return {
            id: undefined,
            version: undefined,
            name: firmaDTO.name,
            branche: firmaDTO.branche,
            umsatz: firmaDTO.umsatz,
            mitarbeiterzahl: firmaDTO.mitarbeiterzahl,
            aktiv: firmaDTO.aktiv,
            gruendungsdatum: firmaDTO.gruendungsdatum,
            website: firmaDTO.website,
            schlagwoerter: firmaDTO.schlagwoerter,
            beschreibung: undefined,
            standorte: undefined,
            erzeugt: undefined,
            aktualisiert: new Date(),
        };
    }
}
