import {
    type CorsOptions
} from '@nestjs/common/interfaces/external/cors-options.interface.js';

export const corsOptions: CorsOptions = {
    origin: [
        'https://studio.apollographql.com',
        'http://localhost:4200',
        'https://localhost:3001',
        'http://localhost:3000',
    ],

    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],

    allowedHeaders: [
        'Origin',
        'Accept',
        'Content-Type',
        'Authorization',
        'Allow',
        'Content-Length',
        'Date',
        'If-Match',
        'If-Not-Match',
        'sec-fetch-mode',
        'sec-fetch-site',
        'sec-fetch-dest',
    ],

    exposedHeaders: [
        'Content-Type',
        'Content-Length',
        'ETag',
        'Location',
        'Date',
        'Last-Modified',
        'Access-Control-Allow-Origin',
        'Content-Security-Policy',
        'Strict-Transport-Security',
        'X-Content-Type-Options',
    ],

    maxAge: 86_400,

    credentials: true,
};
