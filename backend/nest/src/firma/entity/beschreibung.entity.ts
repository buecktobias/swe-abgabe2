import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Firma } from './firma.entity.js';

@Entity()
export class Beschreibung {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    readonly slogan!: string;

    @Column('varchar')
    readonly mission: string | undefined;

    @OneToOne(() => Firma, (firma) => firma.beschreibung)
    @JoinColumn({ name: 'firma_id' })
    firma: Firma | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            slogan: this.slogan,
            mission: this.mission,
        });
}
