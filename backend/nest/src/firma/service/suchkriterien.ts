/**
 * Das Modul besteht aus der Klasse {@linkcode Suchkriterien}.
 * @packageDocumentation
 */

import { type Branche } from '../entity/firma.entity.js';

/**
 * Typdefinition für `find` in `firma-read.service` und `QueryBuilder.build()`.
 */
export type Suchkriterien = {
    readonly id?: number;
    readonly beschreibung?: string;
    readonly standort?: string;
    readonly brance?: Branche;
    readonly umsatz?: number;
    readonly mitarbeiterzahl?: number;
    readonly aktiv?: boolean;
    readonly gruendungsdatum?: string;
    readonly website?: string;
    readonly javascript?: string;
    readonly typescript?: string;
    readonly java?: string;
    readonly python?: string;
};
