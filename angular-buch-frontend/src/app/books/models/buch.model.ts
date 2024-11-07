import { Art } from './art.model';
import { Titel } from './titel.model';
import { Abbildung } from './abbildung.model';

interface BaseBuch {
  isbn: string | null;
  rating: number | null;
  art: Art | null;
  preis: number | null;

  lieferbar: boolean | null;
  datum: string | null;
  homepage: string | null;
  schlagwoerter: string[] | null;
}

export interface Buch extends BaseBuch {
  id: number;
  version: number;
  titel: Titel;
  rabatt: string;
}

export interface BuchInput extends BaseBuch {
  titel: Titel;
  abbildungen: Abbildung[] | null;
  rabatt: number | null;
}

export interface BuchUpdateInput extends BaseBuch {
  id: number | null;
  version: number | null;
  rabatt: number | null;
}
