import {
    contentSecurityPolicy,
    frameguard,
    hidePoweredBy,
    hsts,
    noSniff,
    xssFilter,
} from 'helmet';

export const helmetHandlers = [
    contentSecurityPolicy({
        useDefaults: true,
        directives: {
            // Allow both https and http for development purposes (e.g., Swagger)
            defaultSrc: ["'self'", "https:", "http:"],
            // Explicitly allow loading scripts from localhost and Swagger UI
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https:",
                "http://localhost:3000",  // Swagger UI script loading in development
            ],
            // Allow Swagger UI to load images
            imgSrc: ["'self'", "data:"],
            // Allow connections to localhost for development
            connectSrc: ["'self'", "http://localhost:3000"],
            // Style sources (if Swagger needs inline styles)
            styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
        },
        reportOnly: false,  // Set to true for testing without blocking resources
    }),

    // Other security headers
    xssFilter(),
    frameguard(),
    hsts(),
    noSniff(),
    hidePoweredBy(),
];
