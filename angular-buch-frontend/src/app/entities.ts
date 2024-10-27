export enum Art {
  EPUB = 'EPUB',
  HARDCOVER = 'HARDCOVER',
  PAPERBACK = 'PAPERBACK',
}

export class BuchEntity {
  constructor(
    public id: number,
    public version: number,
    public isbn: string,
    public rating: number | null,
    public art: Art,
    public preis: number,
    public lieferbar: boolean | null,
    public datum: string | null,
    public homepage: string | null,
    public schlagwoerter: string[] | null,
    public titel: TitelEntity,
    public rabatt: string,
  ) {}
}

export class TitelEntity {
  constructor(
    public titel: string,
    public untertitel: string | null,
  ) {}
}

export class AbbildungEntity {
  constructor(
    public beschriftung: string,
    public contentType: string | null,
  ) {}
}
