import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module.js';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { FirmaGetController } from './controller/firma-get.controller.js';
import { FirmaWriteController } from './controller/firma-write.controller.js';
import { entities } from './entity/entities.js';
import { FirmaMutationResolver } from './resolver/firma-mutation.resolver.js';
import { FirmaQueryResolver } from './resolver/firma-query.resolver.js';
import { FirmaReadService } from './service/firma-read.service.js';
import { FirmaWriteService } from './service/firma-write.service.js';
import { QueryBuilder } from './service/query-builder.js';

/**
 * Das Modul besteht aus Controller- und Service-Klassen für die Verwaltung von
 * Firmen.
 * @packageDocumentation
 */

/**
 * Die dekorierte Modul-Klasse mit Controller- und Service-Klassen sowie der
 * Funktionalität für TypeORM.
 */
@Module({
    imports: [KeycloakModule, MailModule, TypeOrmModule.forFeature(entities)],
    controllers: [FirmaGetController, FirmaWriteController],
    // Provider sind z.B. Service-Klassen fuer DI
    providers: [
        FirmaReadService,
        FirmaWriteService,
        FirmaQueryResolver,
        FirmaMutationResolver,
        QueryBuilder,
    ],
    // Export der Provider fuer DI in anderen Modulen
    exports: [FirmaReadService, FirmaWriteService],
})
export class FirmaModule {}
