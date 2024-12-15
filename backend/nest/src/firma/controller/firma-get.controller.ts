/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line max-classes-per-file
import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    NotFoundException,
    Param,
    Query,
    Req,
    Res,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiHeader,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiProperty,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from 'nest-keycloak-connect';
import { paths } from '../../config/paths.js';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { type Beschreibung } from '../entity/beschreibung.entity.js';
import { type Branche, type Firma } from '../entity/firma.entity.js';
import { FirmaReadService } from '../service/firma-read.service.js';
import { type Suchkriterien } from '../service/suchkriterien.js';
import { getBaseUri } from './getBaseUri.js';

export type Link = {
    readonly href: string;
};

export type Links = {
    readonly self: Link;
    readonly list?: Link;
    readonly add?: Link;
    readonly update?: Link;
    readonly remove?: Link;
};

export type BeschreibungModel = Omit<Beschreibung, 'firma' | 'id'>;

export type FirmaModel = Omit<
    Firma,
    | 'standorte'
    | 'dokument'
    | 'aktualisiert'
    | 'erzeugt'
    | 'id'
    | 'beschreibung'
    | 'version'
> & {
    beschreibung: BeschreibungModel;
    _links: Links;
};

export type FirmenModel = {
    _embedded: {
        firmen: FirmaModel[];
    };
};

export class FirmaQuery implements Suchkriterien {
    @ApiProperty({ required: false })
    declare readonly name: string;

    @ApiProperty({ required: false })
    declare readonly branche: Branche;

    @ApiProperty({ required: false })
    declare readonly standort: string;

    @ApiProperty({ required: false })
    declare readonly umsatz: number;

    @ApiProperty({ required: false })
    declare readonly mitarbeiterzahl: number;

    @ApiProperty({ required: false })
    declare readonly aktiv: boolean;

    @ApiProperty({ required: false })
    declare readonly gruendungsdatum: string;

    @ApiProperty({ required: false })
    declare readonly website: string;
}

const APPLICATION_HAL_JSON = 'application/hal+json';

@Controller(paths.rest)
@UseInterceptors(ResponseTimeInterceptor)
@ApiTags('Firma REST-API')
export class FirmaGetController {
    readonly #service: FirmaReadService;

    readonly #logger = getLogger(FirmaGetController.name);

    constructor(service: FirmaReadService) {
        this.#service = service;
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Suche mit der Firma-ID' })
    @ApiParam({
        name: 'id',
        description: 'Z.B. 1',
    })
    @ApiHeader({
        name: 'If-None-Match',
        description: 'Header für bedingte GET-Requests, z.B. "0"',
        required: false,
    })
    @ApiOkResponse({ description: 'Die Firma wurde gefunden' })
    @ApiNotFoundResponse({ description: 'Keine Firma zur ID gefunden' })
    @ApiResponse({
        status: HttpStatus.NOT_MODIFIED,
        description: 'Die Firma wurde bereits heruntergeladen',
    })
    async getById(
        @Param('id') idStr: string,
        @Req() req: Request,
        @Headers('If-None-Match') version: string | undefined,
        @Res() res: Response,
    ): Promise<Response<FirmaModel | undefined>> {
        this.#logger.debug('getById: idStr=%s, version=%s', idStr, version);
        const id = Number(idStr);
        if (!Number.isInteger(id)) {
            this.#logger.debug('getById: not isInteger()');
            throw new NotFoundException(`Die Firma-ID ${idStr} ist ungültig.`);
        }

        if (req.accepts([APPLICATION_HAL_JSON, 'json', 'html']) === false) {
            this.#logger.debug('getById: accepted=%o', req.accepted);
            return res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
        }

        const firma = await this.#service.findById({ id });
        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug('getById(): firma=%s', firma.toString());
            this.#logger.debug(
                'getById(): beschreibung=%o',
                firma.beschreibung,
            );
        }

        const versionDb = firma.version;
        if (version === `"${versionDb}"`) {
            this.#logger.debug('getById: NOT_MODIFIED');
            return res.sendStatus(HttpStatus.NOT_MODIFIED);
        }
        this.#logger.debug('getById: versionDb=%s', versionDb);
        res.header('ETag', `"${versionDb}"`);

        const firmaModel = this.#toModel(firma, req);
        this.#logger.debug('getById: firmaModel=%o', firmaModel);
        return res.contentType(APPLICATION_HAL_JSON).json(firmaModel);
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Suche mit Suchkriterien' })
    @ApiOkResponse({ description: 'Eine evtl. leere Liste mit Firmen' })
    async get(
        @Query() query: FirmaQuery,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<FirmenModel | undefined>> {
        this.#logger.debug('get: query=%o', query);

        if (req.accepts([APPLICATION_HAL_JSON, 'json', 'html']) === false) {
            this.#logger.debug('get: accepted=%o', req.accepted);
            return res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
        }

        const firmen = await this.#service.find(query);
        this.#logger.debug('get: %o', firmen);

        const firmenModel = firmen.map((firma) =>
            this.#toModel(firma, req, false),
        );
        this.#logger.debug('get: firmenModel=%o', firmenModel);

        const result: FirmenModel = { _embedded: { firmen: firmenModel } };
        return res.contentType(APPLICATION_HAL_JSON).json(result).send();
    }

    #toModel(firma: Firma, req: Request, all = true) {
        const baseUri = getBaseUri(req);
        this.#logger.debug('#toModel: baseUri=%s', baseUri);
        const { id } = firma;
        const links = all
            ? {
                  self: { href: `${baseUri}/${id}` },
                  list: { href: `${baseUri}` },
                  add: { href: `${baseUri}` },
                  update: { href: `${baseUri}/${id}` },
                  remove: { href: `${baseUri}/${id}` },
              }
            : { self: { href: `${baseUri}/${id}` } };

        this.#logger.debug('#toModel: firma=%o, links=%o', firma, links);
        const beschreibungModel: BeschreibungModel = {
            slogan: firma.beschreibung?.slogan ?? 'N/A',
            mission: firma.beschreibung?.mission ?? 'N/A',
        };

        // TODO LokationsModel
        const firmaModel: FirmaModel = {
            name: firma.name,
            branche: firma.branche,
            umsatz: firma.umsatz,
            mitarbeiterzahl: firma.mitarbeiterzahl,
            aktiv: firma.aktiv,
            gruendungsdatum: firma.gruendungsdatum,
            website: firma.website,
            schlagwoerter: firma.schlagwoerter,
            beschreibung: beschreibungModel,
            _links: links,
        };

        return firmaModel;
    }
}
