export enum Art {
  EPUB = 'EPUB',
  HARDCOVER = 'HARDCOVER',
  PAPERBACK = 'PAPERBACK',
}

export interface BuchEntity {
  id: number;
  version: number;
  isbn: string;
  rating: number | null;
  art: Art | null;
  preis: number;
  lieferbar: boolean | null;
  datum: string | null;
  homepage: string | null;
  schlagwoerter: string[] | null;
  titel: TitelEntity;
  rabatt: string;
}

export interface TitelEntity {
  titel: string;
  untertitel: string | null;
}
