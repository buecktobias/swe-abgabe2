import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { DataSource } from 'typeorm';
import { getLogger } from '../../logger/logger';
import { dbType } from '../db';
import {
    dbPopulate,
    dbResourcesDir,
    typeOrmModuleOptions,
} from '../typeormOptions';

@Injectable()
export class DbPopulateService implements OnApplicationBootstrap {
    readonly #tabellen = ['buch', 'titel', 'abbildung'];

    readonly #datasource: DataSource;

    readonly #resourcesDir = dbResourcesDir;

    readonly #logger = getLogger(DbPopulateService.name);

    constructor(@InjectDataSource() dataSource: DataSource) {
        this.#datasource = dataSource;
    }

    async onApplicationBootstrap() {
        await this.populateTestdaten();
    }

    async populateTestdaten() {
        if (!dbPopulate || dbType !== 'postgres') return;

        this.#logger.warn(`${typeOrmModuleOptions.type}: DB wird neu geladen`);
        await this.#populatePostgres();
        this.#logger.warn('DB wurde neu geladen');
    }


    async #populatePostgres() {
        this.#logger.warn(`Resource directory: ${this.#resourcesDir}`);
        const dropScript = path.resolve(this.#resourcesDir, 'drop.sql');
        const dropStatements = readFileSync(dropScript, 'utf8');
        await this.#datasource.query(dropStatements);

        const createScript = path.resolve(this.#resourcesDir, 'create.sql');
        const createStatements = readFileSync(createScript, 'utf8');
        await this.#datasource.query(createStatements);

        await this.#datasource.query(`SET search_path TO ${typeOrmModuleOptions!.database};`);

        await this.#loadDataFiles(this.#tabellen, 'csv', ';');
    }

    async #loadDataFiles(tables: string[], fileType: string, delimiter: string) {
        for (const table of tables) {
            const filePath = `/csv/${table}.${fileType}`;
            const query = `COPY ${table} FROM '${filePath}' (FORMAT csv, DELIMITER '${delimiter}', HEADER true);`;
            this.#logger.warn(`Loading data from ${filePath} into ${table}`);
            await this.#datasource.query(query);
        }
    }
}
