/**
 * Das Modul besteht aus der Klasse {@linkcode QueryBuilder}.
 * @packageDocumentation
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmModuleOptions } from '../../config/typeormOptions.js';
import { getLogger } from '../../logger/logger.js';
import { Beschreibung } from '../entity/beschreibung.entity.js';
import { Firma } from '../entity/firma.entity.js';
import { Standort } from '../entity/standort.entity.js';
import { type Suchkriterien } from './suchkriterien.js';

/** Typdefinitionen für die Suche mit der Firma-ID. */
export type BuildIdParams = {
    /** ID der gesuchten Firma. */
    readonly id: number;
    /** Sollen die Standorte mitgeladen werden? */
    readonly mitStandorte?: boolean;
};
/**
 * Die Klasse `QueryBuilder` implementiert das Lesen für Firmen und greift
 * mit _TypeORM_ auf eine relationale DB zu.
 */
@Injectable()
export class QueryBuilder {
    readonly #firmaAlias = `${Firma.name
        .charAt(0)
        .toLowerCase()}${Firma.name.slice(1)}`;

    readonly #beschreibungAlias = `${Beschreibung.name
        .charAt(0)
        .toLowerCase()}${Beschreibung.name.slice(1)}`;

    readonly #standortAlias = `${Standort.name
        .charAt(0)
        .toLowerCase()}${Standort.name.slice(1)}`;

    readonly #repo: Repository<Firma>;

    readonly #logger = getLogger(QueryBuilder.name);

    constructor(@InjectRepository(Firma) repo: Repository<Firma>) {
        this.#repo = repo;
    }

    /**
     * Eine Firma mit der ID suchen.
     * @param id ID der gesuchten Firma
     * @returns QueryBuilder
     */
    buildId({ id, mitStandorte = false }: BuildIdParams) {
        // QueryBuilder "firma" fuer Repository<Firma>
        const queryBuilder = this.#repo.createQueryBuilder(this.#firmaAlias);

        // Fetch-Join: aus QueryBuilder "firma" die Property "beschreibung" ->  Tabelle "beschreibung"
        queryBuilder.innerJoinAndSelect(
            `${this.#firmaAlias}.beschreibung`,
            this.#beschreibungAlias,
        );

        if (mitStandorte) {
            // Fetch-Join: aus QueryBuilder "firma" die Property "Standorte" -> Tabelle "standort"
            queryBuilder.leftJoinAndSelect(
                `${this.#firmaAlias}.standorte`,
                this.#standortAlias,
            );
        }

        queryBuilder.where(`${this.#firmaAlias}.id = :id`, { id: id }); // eslint-disable-line object-shorthand
        return queryBuilder;
    }

    /**
     * Frimen asynchron suchen.
     * @param suchkriterien JSON-Objekt mit Suchkriterien
     * @returns QueryBuilder
     */
    // z.B. { beschreibung: 'a', rating: 5, javascript: true }
    // "rest properties" fuer anfaengliche WHERE-Klausel: ab ES 2018 https://github.com/tc39/proposal-object-rest-spread
    // eslint-disable-next-line max-lines-per-function, sonarjs/cognitive-complexity
    build({
        beschreibung,
        javascript,
        typescript,
        java,
        python,
        ...props
    }: Suchkriterien) {
        this.#logger.debug(
            'build: beschreibung=%s, javascript=%s, typescript=%s, java=%s, python=%s, props=%o',
            beschreibung,
            javascript,
            typescript,
            java,
            python,
            props,
        );

        let queryBuilder = this.#repo.createQueryBuilder(this.#firmaAlias);
        queryBuilder.innerJoinAndSelect(
            `${this.#firmaAlias}.beschreibung`,
            'beschreibung',
        );

        let useWhere = true;

        if (beschreibung !== undefined && typeof beschreibung === 'string') {
            const ilike =
                typeOrmModuleOptions.type === 'postgres' ? 'ilike' : 'like';
            queryBuilder = queryBuilder.where(
                `${this.#beschreibungAlias}.beschreibung ${ilike} :beschreibung`,
                { beschreibung: `%${beschreibung}%` },
            );
            useWhere = false;
        }

        if (javascript === 'true') {
            queryBuilder = useWhere
                ? queryBuilder.where(
                      `${this.#firmaAlias}.schlagwoerter like '%JAVASCRIPT%'`,
                  )
                : queryBuilder.andWhere(
                      `${this.#firmaAlias}.schlagwoerter like '%JAVASCRIPT%'`,
                  );
            useWhere = false;
        }

        if (typescript === 'true') {
            queryBuilder = useWhere
                ? queryBuilder.where(
                      `${this.#firmaAlias}.schlagwoerter like '%TYPESCRIPT%'`,
                  )
                : queryBuilder.andWhere(
                      `${this.#firmaAlias}.schlagwoerter like '%TYPESCRIPT%'`,
                  );
            useWhere = false;
        }

        if (java === 'true') {
            queryBuilder = useWhere
                ? queryBuilder.where(
                      `${this.#firmaAlias}.schlagwoerter like '%JAVA%'`,
                  )
                : queryBuilder.andWhere(
                      `${this.#firmaAlias}.schlagwoerter like '%JAVA%'`,
                  );
            useWhere = false;
        }

        if (python === 'true') {
            queryBuilder = useWhere
                ? queryBuilder.where(
                      `${this.#firmaAlias}.schlagwoerter like '%PYTHON%'`,
                  )
                : queryBuilder.andWhere(
                      `${this.#firmaAlias}.schlagwoerter like '%PYTHON%'`,
                  );
            useWhere = false;
        }

        // Restliche Properties als Key-Value-Paare: Vergleiche auf Gleichheit
        Object.keys(props).forEach((key) => {
            const param: Record<string, any> = {};
            param[key] = (props as Record<string, any>)[key]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment, security/detect-object-injection
            queryBuilder = useWhere
                ? queryBuilder.where(
                      `${this.#firmaAlias}.${key} = :${key}`,
                      param,
                  )
                : queryBuilder.andWhere(
                      `${this.#firmaAlias}.${key} = :${key}`,
                      param,
                  );
            useWhere = false;
        });

        this.#logger.debug('build: sql=%s', queryBuilder.getSql());
        return queryBuilder;
    }
}
