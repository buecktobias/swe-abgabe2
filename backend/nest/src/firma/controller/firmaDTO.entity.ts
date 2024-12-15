/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayUnique,
    IsArray,
    IsBoolean,
    IsISO8601,
    IsOptional,
    IsPositive,
    IsUrl,
    Matches,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Branche } from '../entity/firma.entity.js';
import { BeschreibungDTO } from './beschreibungDTO.entity.js';
import { StandortDTO } from './standortDTO.entity.js';

/**
 * DTO for a company entity without references.
 */
export class FirmaDtoOhneRef {
    @MaxLength(50)
    @ApiProperty({ example: 'Tech Solutions GmbH', type: String })
    readonly name!: string;

    @Matches(/^(IT|FINANZEN|GESUNDHEIT|BILDUNG)$/u)
    @IsOptional()
    @ApiProperty({ example: 'IT', type: String })
    readonly branche: Branche | undefined;

    @IsPositive()
    @ApiProperty({ example: 50000, type: Number })
    readonly umsatz!: number;

    @IsPositive()
    @ApiProperty({ example: 50000, type: Number })
    readonly mitarbeiterzahl!: number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true, type: Boolean })
    readonly aktiv: boolean | undefined;

    @IsISO8601({ strict: true })
    @IsOptional()
    @ApiProperty({ example: '2015-08-01', type: String })
    readonly gruendungsdatum: Date | string | undefined;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ example: 'https://techsolutions.de', type: String })
    readonly website: string | undefined;

    @IsOptional()
    @ArrayUnique()
    @ApiProperty({ example: ['JAVASCRIPT', 'TYPESCRIPT', 'PHYTON'] })
    readonly schlagwoerter: string[] | undefined;
}

/**
 * DTO for a company entity with nested references.
 */
export class FirmaDTO extends FirmaDtoOhneRef {
    @ValidateNested()
    @Type(() => BeschreibungDTO)
    @ApiProperty({ type: BeschreibungDTO })
    readonly beschreibung!: BeschreibungDTO;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StandortDTO)
    @ApiProperty({ type: [StandortDTO] })
    readonly standorte: StandortDTO[] | undefined;
}
