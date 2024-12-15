import { RESOURCES_DIR, config } from './app.js';
import { env } from './env.js';
import { httpsOptions } from './https.js';

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
