import { Art } from '../entities';

export class BuchInput {
  constructor(
    public isbn: string | null,
    public rating: number | null,
    public art: Art | null,
    public preis: number | null,
    public rabatt: number | null,
    public lieferbar: boolean | null,
    public datum: string | null,
    public homepage: string | null,
    public schlagwoerter: string[] | null,
    public titel: TitelInput,
    public abbildungen: AbbildungInput[] | null,
  ) {}
}

// inputs/buch-update-input.ts
export class BuchUpdateInput {
  constructor(
    public id: number | null,
    public version: number | null,
    public isbn: string | null,
    public rating: number | null,
    public art: Art | null,
    public preis: number | null,
    public rabatt: number | null,
    public lieferbar: boolean | null,
    public datum: string | null,
    public homepage: string | null,
    public schlagwoerter: string[] | null,
  ) {}
}

export class TitelInput {
  constructor(
    public titel: string,
    public untertitel: string | null,
  ) {}
}

export class AbbildungInput {
  constructor(
    public beschriftung: string,
    public contentType: string,
  ) {}
}

export class SuchkriterienInput {
  constructor(
    public titel: string | null,
    public isbn: string | null,
    public rating: number | null,
    public art: Art | null,
    public lieferbar: boolean | null,
  ) {}
}
