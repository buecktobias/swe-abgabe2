/**
 * Das Modul besteht aus der Klasse {@linkcode FirmaWriteService} für die
 * Schreiboperationen im Anwendungskern.
 * @packageDocumentation
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type DeleteResult, Repository } from 'typeorm';
import { getLogger } from '../../logger/logger.js';
import { MailService } from '../../mail/mail.service.js';
import { Beschreibung } from '../entity/beschreibung.entity.js';
import { Firma } from '../entity/firma.entity.js';
import { Standort } from '../entity/standort.entity.js';
import {
    NameExistsException,
    VersionInvalidException,
    VersionOutdatedException,
} from './exceptions.js';
import { FirmaReadService } from './firma-read.service.js';

/** Typdefinitionen zum Aktualisieren einer Firma mit `update`. */
export type UpdateParams = {
    /** ID der zu aktualisierenden Firma. */
    readonly id: number | undefined;
    /** Firma-Objekt mit den aktualisierten Werten. */
    readonly firma: Firma;
    /** Versionsnummer für die aktualisierenden Werte. */
    readonly version: string;
};

/**
 * Die Klasse `FirmaWriteService` implementiert den Anwendungskern für das
 * Schreiben von Firmen und greift mit _TypeORM_ auf die DB zu.
 */
@Injectable()
export class FirmaWriteService {
    private static readonly VERSION_PATTERN = /^"\d{1,3}"/u;

    readonly #repo: Repository<Firma>;

    readonly #readService: FirmaReadService;

    readonly #mailService: MailService;

    readonly #logger = getLogger(FirmaWriteService.name);

    constructor(
        @InjectRepository(Firma) repo: Repository<Firma>,
        readService: FirmaReadService,
        mailService: MailService,
    ) {
        this.#repo = repo;
        this.#readService = readService;
        this.#mailService = mailService;
    }

    /**
     * Eine neue Firma soll angelegt werden.
     * @param firma Das neu abzulegende Firma
     * @returns Die ID der neu angelegten Firma
     * @throws IDExists falls die ID-Nummer bereits existiert
     */
    async create(firma: Firma): Promise<number> {
        this.#logger.debug('create: firma=%o', firma);
        await this.#validateCreate(firma);

        const firmaDb = await this.#repo.save(firma); // implizite Transaktion
        this.#logger.debug('create: firmaDb=%o', firmaDb);

        await this.#sendmail(firmaDb);

        return firmaDb.id!;
    }

    /**
     * Eine vorhandene Firma soll aktualisiert werden. "Destructured" Argument
     * mit id (ID der zu aktualisierenden Firma), Firma (zu aktualisierenden Firma)
     * und version (Versionsnummer für optimistische Synchronisation).
     * @returns Die neue Versionsnummer gemäß optimistischer Synchronisation
     * @throws NotFoundException falls keine Firma zur ID vorhanden ist
     * @throws VersionInvalidException falls die Versionsnummer ungültig ist
     * @throws VersionOutdatedException falls die Versionsnummer veraltet ist
     */
    // https://2ality.com/2015/01/es6-destructuring.html#simulating-named-parameters-in-javascript
    async update({ id, firma, version }: UpdateParams): Promise<number> {
        this.#logger.debug(
            'update: id=%d, firma=%o, version=%s',
            id,
            firma,
            version,
        );
        if (id === undefined) {
            this.#logger.debug('update: Keine gueltige ID');
            throw new NotFoundException(`Es gibt kein Firma mit der ID ${id}.`);
        }

        const validateResult = await this.#validateUpdate(firma, id, version);
        this.#logger.debug('update: validateResult=%o', validateResult);
        if (!(validateResult instanceof Firma)) {
            return validateResult;
        }

        const firmaNeu = validateResult;
        const merged = this.#repo.merge(firmaNeu, firma);
        this.#logger.debug('update: merged=%o', merged);
        const updated = await this.#repo.save(merged); // implizite Transaktion
        this.#logger.debug('update: updated=%o', updated);

        return updated.version!;
    }

    /**
     * Eine Firma wird asynchron anhand seiner ID gelöscht.
     *
     * @param id ID der zu löschenden Firma
     * @returns true, falls die Firma vorhanden war und gelöscht wurde. Sonst false.
     */
    async delete(id: number) {
        this.#logger.debug('delete: id=%d', id);
        const firma = await this.#readService.findById({
            id,
            mitStandorte: true,
        });

        let deleteResult: DeleteResult | undefined;
        await this.#repo.manager.transaction(async (transactionalMgr) => {
            // Das Firma zur gegebenen ID mit Beschreibung und Abb. asynchron loeschen

            // TODO "cascade" funktioniert nicht beim Loeschen
            const beschreibungId = firma.beschreibung?.id;
            if (beschreibungId !== undefined) {
                await transactionalMgr.delete(Beschreibung, beschreibungId);
            }
            // "Nullish Coalescing" ab ES2020
            const standorte = firma.standorte ?? [];
            for (const standort of standorte) {
                await transactionalMgr.delete(Standort, standort.id);
            }

            deleteResult = await transactionalMgr.delete(Firma, id);
            this.#logger.debug('delete: deleteResult=%o', deleteResult);
        });

        return (
            deleteResult?.affected !== undefined &&
            deleteResult.affected !== null &&
            deleteResult.affected > 0
        );
    }

    async #validateCreate({ name }: Firma): Promise<undefined> {
        this.#logger.debug('#validateCreate: id=%s', name);
        if (await this.#repo.existsBy({ name })) {
            throw new NameExistsException(name);
        }
    }

    async #sendmail(firma: Firma) {
        const subject = `Neues Firma ${firma.id}`;
        const beschreibung = firma.beschreibung?.slogan ?? 'N/A';
        const body = `Das Firma mit dem beschreibung <strong>${beschreibung}</strong> ist angelegt`;
        await this.#mailService.sendmail({ subject, body });
    }

    async #validateUpdate(
        firma: Firma,
        id: number,
        versionStr: string,
    ): Promise<Firma> {
        this.#logger.debug(
            '#validateUpdate: firma=%o, id=%s, versionStr=%s',
            firma,
            id,
            versionStr,
        );
        if (!FirmaWriteService.VERSION_PATTERN.test(versionStr)) {
            throw new VersionInvalidException(versionStr);
        }

        const version = Number.parseInt(versionStr.slice(1, -1), 10);
        this.#logger.debug(
            '#validateUpdate: firma=%o, version=%d',
            firma,
            version,
        );

        const firmaDb = await this.#readService.findById({ id });

        // nullish coalescing
        const versionDb = firmaDb.version!;
        if (version < versionDb) {
            this.#logger.debug('#validateUpdate: versionDb=%d', version);
            throw new VersionOutdatedException(version);
        }
        this.#logger.debug('#validateUpdate: firmaDb=%o', firmaDb);
        return firmaDb;
    }
}
