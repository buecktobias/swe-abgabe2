import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { Firma } from '../entity/firma.entity.js';
import { FirmaReadService } from '../service/firma-read.service.js';
import { type Suchkriterien } from '../service/suchkriterien.js';
import { HttpExceptionFilter } from './http-exception.filter.js';

export type IdInput = {
    readonly id: number;
};

export type SuchkriterienInput = {
    readonly suchkriterien: Suchkriterien;
};

@Resolver('Firma')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class FirmaQueryResolver {
    readonly #service: FirmaReadService;

    readonly #logger = getLogger(FirmaQueryResolver.name);

    constructor(service: FirmaReadService) {
        this.#service = service;
    }

    @Query('Firma')
    @Public()
    async findById(@Args() { id }: IdInput) {
        this.#logger.debug('findById: id=%d', id);

        const firma = await this.#service.findById({ id });

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: firma=%s, beschreibung=%o',
                firma.toString(),
                firma.beschreibung,
            );
        }
        return firma;
    }

    @Query('Firmen')
    @Public()
    async find(@Args() input: SuchkriterienInput | undefined) {
        this.#logger.debug('find: input=%o', input);
        const firmen = await this.#service.find(input?.suchkriterien);
        this.#logger.debug('find: firmen=%o', firmen);
        return firmen;
    }

    @ResolveField('mitarbeiterzahl')
    mitarbeiterzahl(@Parent() firma: Firma, short: boolean | undefined) {
        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'mitarbeiterzahl: firma=%s, short=%s',
                firma.toString(),
                short,
            );
        }

        // eslint-disable-next-line sonarjs/prefer-immediate-return
        const mitarbeiterzahl = firma.mitarbeiterzahl ?? 0;

        return mitarbeiterzahl;
    }
}
