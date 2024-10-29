import { Art, BuchEntity } from '../../entities';

export const mockBooks: BuchEntity[] = [
  {
    id: 1,
    isbn: '1234567890',
    titel: { titel: 'Book 1', untertitel: 'Subtitle 1' },
    version: 0,
    art: Art.EPUB,
    preis: 1,
    rabatt: '',
  },
  {
    id: 2,
    isbn: '0987654321',
    titel: { titel: 'Book 2', untertitel: 'Subtitle 2' },
    version: 0,
    art: Art.EPUB,
    preis: 2,
    rabatt: '10%',
  },
];
