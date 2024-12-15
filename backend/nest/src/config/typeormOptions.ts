// Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

/**
 * Das Modul enthält die Konfiguration für den Zugriff auf die DB.
 * @packageDocumentation
 */
import path from 'node:path';
import {type DataSourceOptions} from 'typeorm';
import {Firma} from '../firma/entity/firma.entity.js';
import {entities} from '../firma/entity/entities.js';
import {config} from './app.js';
import {dbType} from './db.js';
import {logLevel} from './logger.js';
import {nodeConfig} from './node.js';
import {OracleNamingStrategy, SnakeNamingStrategy,} from './typeormNamingStrategy.js';

const {db} = config;

const database = (db?.name as string | undefined) ?? Firma.name.toLowerCase();

const host = (db?.host as string | undefined) ?? 'localhost';
const username =
    (db?.username as string | undefined) ?? Firma.name.toLowerCase();
const pass = (db?.password as string | undefined) ?? 'p';
const passAdmin = (db?.passwordAdmin as string | undefined) ?? 'p';

// https://github.com/tonivj5/typeorm-naming-strategies/blob/master/src/snake-naming.strategy.ts
// https://github.com/typeorm/typeorm/blob/master/src/naming-strategy/DefaultNamingStrategy.ts
// https://github.com/typeorm/typeorm/blob/master/sample/sample12-custom-naming-strategy/naming-strategy/CustomNamingStrategy.ts
const namingStrategy =
    dbType === 'oracle'
        ? new OracleNamingStrategy()
        : new SnakeNamingStrategy();

// logging bei TypeORM durch console.log()
const logging =
    (nodeConfig.nodeEnv === 'development' || nodeConfig.nodeEnv === 'test') &&
    logLevel === 'debug';
const logger = 'advanced-console';

export const dbResourcesDir = path.resolve(
    nodeConfig.resourcesDir,
    'db',
    dbType,
);
console.debug('dbResourcesDir = %s', dbResourcesDir);

let dataSourceOptions: DataSourceOptions;

dataSourceOptions = {
    type: 'postgres',
    host,
    port: 5432,
    username,
    password: pass,
    database,
    schema: username,
    poolSize: 10,
    entities,
    namingStrategy,
    logging,
    logger,
    ssl: false,
};
Object.freeze(dataSourceOptions);
export const typeOrmModuleOptions = dataSourceOptions;

if (logLevel === 'debug') {
    // "rest properties" ab ES 2018: https://github.com/tc39/proposal-object-rest-spread
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {password, ssl, ...typeOrmModuleOptionsLog} =
        typeOrmModuleOptions as any;
    console.debug('typeOrmModuleOptions = %o', typeOrmModuleOptionsLog);
}

export const dbPopulate = db?.populate === true;
let adminDataSourceOptionsTemp: DataSourceOptions | undefined;
adminDataSourceOptionsTemp = {
    type: 'postgres',
    host,
    port: 5432,
    username: 'firma',
    password: passAdmin,
    database,
    schema: database,
    namingStrategy,
    logging,
    logger,
    ssl: false,
};
export const adminDataSourceOptions = adminDataSourceOptionsTemp;
