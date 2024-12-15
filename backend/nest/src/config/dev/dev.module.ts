import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Firma } from '../../firma/entity/firma.entity.js';
import { KeycloakModule } from '../../security/keycloak/keycloak.module.js';
import { DbPopulateService } from './db-populate.service.js';
import { DevController } from './dev.controller.js';

@Module({
    imports: [KeycloakModule, TypeOrmModule.forFeature([Firma])],
    controllers: [DevController],
    providers: [DbPopulateService],
    exports: [DbPopulateService],
})
export class DevModule {}
