import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    type SwaggerCustomOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module';
import { corsOptions } from './config/cors';
import { nodeConfig } from './config/node';
import { paths } from './config/paths';
import { helmetHandlers } from './security/http/helmet.handler';
import { promises as fs } from 'fs';

const { port } = nodeConfig;

const setupSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Buc')
        .setDescription('Buch')
        .setVersion('2024.11.1')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    const options: SwaggerCustomOptions = { customSiteTitle: 'Buch' };
    SwaggerModule.setup(paths.swagger, app, document, options);
};

async function waitForFile(filePath: string, interval = 10_000): Promise<void> {
    for (let i = 0; i < 10; i++) {
        try {
            await fs.access(filePath);
            return;
        } catch (err) {
            console.log(`Waiting for Keycloak`);
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    }
}

const bootstrap = async () => {

    await waitForFile('/secrets/client_secret.txt');
    const app = await NestFactory.create(AppModule);

    app.use(helmetHandlers, compression());

    app.useGlobalPipes(new ValidationPipe());

    setupSwagger(app);

    app.enableCors(corsOptions);

    await app.listen(port, '0.0.0.0');
};

await bootstrap();
