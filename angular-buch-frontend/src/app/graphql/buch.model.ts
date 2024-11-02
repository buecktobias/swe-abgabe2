import { Art } from './art.model';

import { Titel } from './titel.model';

export interface Buch {
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
  titel: Titel;
  rabatt: string;
}
