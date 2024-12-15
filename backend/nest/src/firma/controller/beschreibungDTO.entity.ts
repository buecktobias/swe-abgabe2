/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches, MaxLength } from 'class-validator';

/**
 * DTO-Klasse für die Beschreibung einer Firma ohne TypeORM.
 */
export class BeschreibungDTO {
    @Matches(String.raw`^\w.*`)
    @MaxLength(100)
    @ApiProperty({ example: 'Innovating the Future', type: String })
    readonly slogan!: string;

    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        example:
            'Our mission is to create a sustainable future through innovation.',
        type: String,
    })
    readonly mission: string | undefined;
}
