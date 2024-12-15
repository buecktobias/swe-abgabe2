/**
 * Das Modul besteht aus der Klasse {@linkcode FirmaReadService}.
 * @packageDocumentation
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { getLogger } from '../../logger/logger.js';
import { Firma } from '../entity/firma.entity.js';
import { QueryBuilder } from './query-builder.js';
import { type Suchkriterien } from './suchkriterien.js';

/**
 * Typdefinition für `findById`
 */
export type FindByIdParams = {
    /** ID der gesuchten Firma */
    readonly id: number;
    /** Sollen die Standorte mitgeladen werden? */
    readonly mitStandorte?: boolean;
};

/**
 * Die Klasse `FirmaReadService` implementiert das Lesen für Bücher und greift
 * mit _TypeORM_ auf eine relationale DB zu.
 */
@Injectable()
export class FirmaReadService {
    static readonly ID_PATTERN = /^[1-9]\d{0,10}$/u;

    readonly #firmaProps: string[];

    readonly #queryBuilder: QueryBuilder;

    readonly #logger = getLogger(FirmaReadService.name);

    constructor(queryBuilder: QueryBuilder) {
        const firmaDummy = new Firma();
        this.#firmaProps = Object.getOwnPropertyNames(firmaDummy);
        this.#queryBuilder = queryBuilder;
    }

    /**
     * Eine Firma asynchron anhand seiner ID suchen
     * @param id ID der gesuchten Firma
     * @returns Die gefundene Firma in einem Promise aus ES2015.
     * @throws NotFoundException falls keine Firma mit der ID existiert
     */
    // https://2ality.com/2015/01/es6-destructuring.html#simulating-named-parameters-in-javascript
    async findById({ id, mitStandorte = false }: FindByIdParams) {
        this.#logger.debug('findById: id=%d', id);

        // https://typeorm.io/working-with-repository
        // Das Resultat ist undefined, falls kein Datensatz gefunden
        // Lesen: Keine Transaktion erforderlich
        const firma = await this.#queryBuilder
            .buildId({ id, mitStandorte })
            .getOne();
        if (firma === null) {
            throw new NotFoundException(`Es gibt kein firma mit der ID ${id}.`);
        }
        if (firma.schlagwoerter === null) {
            firma.schlagwoerter = [];
        }

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: firma=%s, beschreibung=%o',
                firma.toString(),
                firma.beschreibung,
            );
            if (mitStandorte) {
                this.#logger.debug('findById: standorte=%o', firma.standorte);
            }
        }
        return firma;
    }

    /**
     * Firmen asynchron suchen.
     * @param suchkriterien JSON-Objekt mit Suchkriterien
     * @returns Ein JSON-Array mit den gefundenen Büchern.
     * @throws NotFoundException falls keine Firmen gefunden wurden.
     */
    async find(suchkriterien?: Suchkriterien) {
        this.#logger.debug('find: suchkriterien=%o', suchkriterien);

        // Keine Suchkriterien?
        if (suchkriterien === undefined) {
            return this.#queryBuilder.build({}).getMany();
        }
        const keys = Object.keys(suchkriterien);
        if (keys.length === 0) {
            return this.#queryBuilder.build(suchkriterien).getMany();
        }

        // Falsche Namen fuer Suchkriterien?
        if (!this.#checkKeys(keys)) {
            throw new NotFoundException('Ungueltige Suchkriterien');
        }

        // QueryBuilder https://typeorm.io/select-query-builder
        // Das Resultat ist eine leere Liste, falls nichts gefunden
        // Lesen: Keine Transaktion erforderlich
        const firmen = await this.#queryBuilder.build(suchkriterien).getMany();
        if (firmen.length === 0) {
            this.#logger.debug('find: Keine firmen gefunden');
            throw new NotFoundException(
                `Keine firmen gefunden: ${JSON.stringify(suchkriterien)}`,
            );
        }
        firmen.forEach((firma) => {
            if (firma.schlagwoerter === null) {
                firma.schlagwoerter = [];
            }
        });
        this.#logger.debug('find: firmen=%o', firmen);
        return firmen;
    }

    #checkKeys(keys: string[]) {
        // Ist jedes Suchkriterium auch eine Property von Firma oder "schlagwoerter"?
        let validKeys = true;
        keys.forEach((key) => {
            if (
                !this.#firmaProps.includes(key) &&
                key !== 'javascript' &&
                key !== 'typescript'
            ) {
                this.#logger.debug(
                    '#checkKeys: ungueltiges Suchkriterium "%s"',
                    key,
                );
                validKeys = false;
            }
        });

        return validKeys;
    }
}
