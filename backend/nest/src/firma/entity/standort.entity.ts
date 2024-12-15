import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Firma } from './firma.entity.js';

@Entity()
export class Standort {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    readonly adresse!: string;

    @Column('varchar')
    readonly land: string | undefined;

    @Column('varchar')
    readonly stadt: string | undefined;

    @ManyToOne(() => Firma, (firma) => firma.standorte)
    @JoinColumn({ name: 'firma_id' })
    firma: Firma | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            adresse: this.adresse,
            land: this.land,
            stadt: this.stadt,
        });
}
