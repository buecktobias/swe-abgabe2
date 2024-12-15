import { type Request } from 'express';
import { nodeConfig } from '../../config/node.js';
import { FirmaReadService } from '../service/firma-read.service.js';

const port = `:${nodeConfig.port}`;

export const getBaseUri = ({ protocol, hostname, url }: Request) => {
    let basePath = url.includes('?') ? url.slice(0, url.lastIndexOf('?')) : url;

    const indexLastSlash = basePath.lastIndexOf('/');
    if (indexLastSlash > 0) {
        const idStr = basePath.slice(indexLastSlash + 1);
        if (FirmaReadService.ID_PATTERN.test(idStr)) {
            basePath = basePath.slice(0, indexLastSlash);
        }
    }

    return `${protocol}://${hostname}${port}${basePath}`;
};
