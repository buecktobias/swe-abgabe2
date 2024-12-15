import { RESOURCES_DIR, config } from './app';
import { env } from './env';
import { httpsOptions } from './https';

const { NODE_ENV, NEST_HOST } = env;

const port = (config.node?.port as number | undefined) ?? 3000;

export const nodeConfig = {
    host: NEST_HOST,
    port,
    resourcesDir: RESOURCES_DIR,
    httpsOptions,
    nodeEnv: NODE_ENV as
        | 'development'
        | 'PRODUCTION'
        | 'production'
        | 'test'
        | undefined,
} as const;
