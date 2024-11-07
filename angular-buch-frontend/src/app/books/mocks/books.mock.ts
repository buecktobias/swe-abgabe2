import { Buch } from '../models/buch.model';
import { Art } from '../models/art.model';

export const mockBooks: Buch[] = [
  {
    id: 1,
    datum: '2023-01-01',
    homepage: 'http://example.com',
    lieferbar: true,
    rating: 4,
    schlagwoerter: ['fiction', 'new release'],
    isbn: '1234567890',
    titel: { titel: 'Book 1', untertitel: 'Subtitle 1' },
    version: 0,
    art: Art.EPUB,
    preis: 1,
    rabatt: '',
  },
  {
    id: 2,
    datum: '2023-01-01',
    homepage: 'http://example.com',
    lieferbar: true,
    rating: 4,
    schlagwoerter: ['fiction', 'new release'],
    isbn: '0987654321',
    titel: { titel: 'Book 2', untertitel: 'Subtitle 2' },
    version: 0,
    art: Art.EPUB,
    preis: 2,
    rabatt: '10%',
  },
];
