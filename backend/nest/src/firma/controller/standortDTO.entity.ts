/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

/**
 * DTO-Klasse für die Standortinformationen einer Firma.
 */
export class StandortDTO {
    @MaxLength(100)
    @ApiProperty({ example: '123 Hauptstraße, 10115 Berlin', type: String })
    readonly adresse!: string;

    @MaxLength(50)
    @ApiProperty({ example: 'Deutschland', type: String })
    readonly land: string | undefined;

    @MaxLength(50)
    @ApiProperty({ example: 'Berlin', type: String })
    readonly stadt: string | undefined;
}
