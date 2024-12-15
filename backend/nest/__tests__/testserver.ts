import { nodeConfig } from '../src/config/node';
import { paths } from '../src/config/paths';

export const tokenPath = `${paths.auth}/${paths.token}`;
export const refreshPath = `${paths.auth}/${paths.refresh}`;

export const { host, port } = nodeConfig;

export const httpType = 'http';
