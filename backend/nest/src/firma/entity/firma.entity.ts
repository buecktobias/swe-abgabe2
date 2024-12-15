import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { dbType } from '../../config/db.js';
import { Standort } from './standort.entity.js';
// import { Dokument } from './dokument.entity.js.js';
import { Beschreibung } from './beschreibung.entity.js';
import { DecimalTransformer } from './decimal-transformer.js';

/**
 * Alias-Typ für gültige Strings bei der Branche einer Firma.
 */
export type Branche = 'IT' | 'Finanzen' | 'Gesundheit' | 'Bildung';

@Entity()
export class Firma {
    @Column('int')
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @VersionColumn()
    readonly version: number | undefined;

    @Column()
    @ApiProperty({ example: 'TechSolutions GmbH', type: String })
    readonly name!: string;

    @Column('varchar')
    @ApiProperty({ example: 'IT', type: String })
    readonly branche: Branche | undefined;

    @Column('decimal', {
        precision: 12,
        scale: 2,
        transformer: new DecimalTransformer(),
    })
    // eslint-disable-next-line unicorn/numeric-separators-style, unicorn/no-zero-fractions
    @ApiProperty({ example: 500000.0, type: Number })
    readonly umsatz!: number;

    @Column('int')
    @ApiProperty({ example: 50, type: Number })
    readonly mitarbeiterzahl: number | undefined;

    @Column('boolean')
    @ApiProperty({ example: true, type: Boolean })
    readonly aktiv: boolean | undefined;

    @Column('date')
    @ApiProperty({ example: '2005-05-15', type: String })
    readonly gruendungsdatum: Date | string | undefined;

    @Column('varchar')
    @ApiProperty({ example: 'https://techsolutions.de/', type: String })
    readonly website: string | undefined;

    @Column('simple-array')
    schlagwoerter: string[] | null | undefined;

    @OneToOne(() => Beschreibung, (beschreibung) => beschreibung.firma, {
        cascade: ['insert', 'remove'],
    })
    readonly beschreibung: Beschreibung | undefined;

    @OneToMany(() => Standort, (standort) => standort.firma, {
        cascade: ['insert', 'remove'],
    })
    readonly standorte: Standort[] | undefined;

    @CreateDateColumn({
        type: dbType === 'sqlite' ? 'datetime' : 'timestamp',
    })
    readonly erzeugt: Date | undefined;

    @UpdateDateColumn({
        type: dbType === 'sqlite' ? 'datetime' : 'timestamp',
    })
    readonly aktualisiert: Date | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            version: this.version,
            name: this.name,
            branche: this.branche,
            umsatz: this.umsatz,
            mitarbeiterzahl: this.mitarbeiterzahl,
            aktiv: this.aktiv,
            gruendungsdatum: this.gruendungsdatum,
            website: this.website,
            schlagwoerter: this.schlagwoerter,
            erzeugt: this.erzeugt,
            aktualisiert: this.aktualisiert,
        });
}
