import { Art } from './art.model';

export interface BuchInput {
  isbn: string | null;
  rating: number | null;
  art: Art | null;
  preis: number | null;
  rabatt: number | null;
  lieferbar: boolean | null;
  datum: string | null;
  homepage: string | null;
  schlagwoerter: string[] | null;
  titel: TitelInput;
  abbildungen: AbbildungInput[] | null;
}

export interface BuchUpdateInput {
  id: number | null;
  version: number | null;
  isbn: string | null;
  rating: number | null;
  art: Art | null;
  preis: number | null;
  rabatt: number | null;
  lieferbar: boolean | null;
  datum: string | null;
  homepage: string | null;
  schlagwoerter: string[] | null;
}

export interface TitelInput {
  titel: string;
  untertitel: string | null;
}

export interface AbbildungInput {
  beschriftung: string | null;
  contentType: string | null;
}

export interface SuchkriterienInput {
  titel?: string | null;
  isbn?: string | null;
  rating?: number | null;
  art?: Art | null;
  lieferbar?: boolean | null;
}
