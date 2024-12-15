/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable max-classes-per-file */
import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IsInt, IsNumberString, Min } from 'class-validator';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { FirmaDTO } from '../controller/firmaDTO.entity.js';
import { type Beschreibung } from '../entity/beschreibung.entity.js';
import { type Firma } from '../entity/firma.entity.js';
import { type Standort } from '../entity/standort.entity.js';
import { FirmaWriteService } from '../service/firma-write.service.js';
import { type IdInput } from './firma-query.resolver.js';
import { HttpExceptionFilter } from './http-exception.filter.js';

export type CreatePayload = {
    readonly id: number;
};

export type UpdatePayload = {
    readonly version: number;
};

export class FirmaUpdateDTO extends FirmaDTO {
    @IsNumberString()
    readonly id!: string;

    @IsInt()
    @Min(0)
    readonly version!: number;
}
@Resolver('firma')
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class FirmaMutationResolver {
    readonly #service: FirmaWriteService;

    readonly #logger = getLogger(FirmaMutationResolver.name);

    constructor(service: FirmaWriteService) {
        this.#service = service;
    }

    @Mutation()
    @Roles({ roles: ['admin', 'user'] })
    async create(@Args('input') firmaDTO: FirmaDTO) {
        this.#logger.debug('create: firmaDTO=%o', firmaDTO);

        const firma = this.#firmaDtoToFirma(firmaDTO);
        const id = await this.#service.create(firma);
        this.#logger.debug('createFirma: id=%d', id);
        const payload: CreatePayload = { id };
        return payload;
    }

    @Mutation()
    @Roles({ roles: ['admin', 'user'] })
    async update(@Args('input') firmaDTO: FirmaUpdateDTO) {
        this.#logger.debug('update: firma=%o', firmaDTO);

        const firma = this.#firmaUpdateDtoToFirma(firmaDTO);
        const versionStr = `"${firmaDTO.version.toString()}"`;

        const versionResult = await this.#service.update({
            id: Number.parseInt(firmaDTO.id, 10),
            firma,
            version: versionStr,
        });
        this.#logger.debug('updateFirma: versionResult=%d', versionResult);
        const payload: UpdatePayload = { version: versionResult };
        return payload;
    }

    @Mutation()
    @Roles({ roles: ['admin'] })
    async delete(@Args() id: IdInput) {
        const idStr = id.id;
        this.#logger.debug('delete: id=%s', idStr);
        const deletePerformed = await this.#service.delete(idStr);
        this.#logger.debug('deleteFirma: deletePerformed=%s', deletePerformed);
        return deletePerformed;
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
        const firma: Firma = {
            id: undefined,
            name: firmaDTO.name,
            version: undefined,
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

        // Rueckwaertsverweis
        firma.beschreibung!.firma = firma;
        return firma;
    }

    #firmaUpdateDtoToFirma(firmaDTO: FirmaUpdateDTO): Firma {
        return {
            id: undefined,
            name: firmaDTO.name,
            version: undefined,
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
