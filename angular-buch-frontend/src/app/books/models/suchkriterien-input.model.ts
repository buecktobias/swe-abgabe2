import { Art } from './art.model';

export interface SuchkriterienInput {
  titel?: string | null;
  isbn?: string | null;
  rating?: number | null;
  art?: Art | null;
  lieferbar?: boolean | null;
}
