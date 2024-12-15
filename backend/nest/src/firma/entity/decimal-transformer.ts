/**
 * Das Modul besteht aus der Transformer-Klasse für Spalten vom Typ DECIMAL.
 * @packageDocumentation
 */

import { type ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
    to(decimal?: number): string | undefined {
        return decimal?.toString();
    }

    from(decimal?: string): number | undefined {
        return decimal === undefined ? undefined : Number(decimal);
    }
}
