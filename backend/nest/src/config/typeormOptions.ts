import path from 'node:path';
import { type DataSourceOptions } from 'typeorm';
import { entities } from '../buch/entity/entities.js';
import { config } from './app.js';
import { logLevel } from './logger.js';
import { nodeConfig } from './node.js';
import { SnakeNamingStrategy } from './typeormNamingStrategy.js';

const { db } = config;

const database = db?.name ?? 'buch';
const host = db?.host ?? 'postgres';
const username = db?.username ?? 'postgres';
const pass = db?.password ?? 'p';

const namingStrategy = new SnakeNamingStrategy();

const logging =
    (nodeConfig.nodeEnv === 'development' || nodeConfig.nodeEnv === 'test') &&
    logLevel === 'debug';
const logger = 'advanced-console';

export const dbResourcesDir = path.resolve(
    nodeConfig.resourcesDir,
    'db',
    'postgres',
);


export const typeOrmModuleOptions: DataSourceOptions = {
    type: 'postgres',
    host,
    port: 5432,
    username,
    password: pass,
    database,
    schema: 'buch',
    poolSize: 10,
    entities,
    namingStrategy,
    logging,
    logger,
    ssl: false,
};

export const dbPopulate = db?.populate === true;
