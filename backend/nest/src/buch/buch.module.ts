// Copyright (C) 2021 - present Juergen Zimmermann, Hochschule Karlsruhe
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { KeycloakModule } from '../security/keycloak/keycloak.module';
import { BuchGetController } from './controller/buch-get.controller';
import { BuchWriteController } from './controller/buch-write.controller';
import { entities } from './entity/entities';
import { BuchMutationResolver } from './resolver/buch-mutation.resolver';
import { BuchQueryResolver } from './resolver/buch-query.resolver';
import { BuchReadService } from './service/buch-read.service';
import { BuchWriteService } from './service/buch-write.service';
import { QueryBuilder } from './service/query-builder';

/**
 * Das Modul besteht aus Controller- und Service-Klassen für die Verwaltung von
 * Bücher.
 * @packageDocumentation
 */

/**
 * Die dekorierte Modul-Klasse mit Controller- und Service-Klassen sowie der
 * Funktionalität für TypeORM.
 */
@Module({
    imports: [KeycloakModule, MailModule, TypeOrmModule.forFeature(entities)],
    controllers: [BuchGetController, BuchWriteController],
    // Provider sind z.B. Service-Klassen fuer DI
    providers: [
        BuchReadService,
        BuchWriteService,
        BuchQueryResolver,
        BuchMutationResolver,
        QueryBuilder,
    ],
    // Export der Provider fuer DI in anderen Modulen
    exports: [BuchReadService, BuchWriteService],
})
export class BuchModule {}
