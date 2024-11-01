import { Component } from '@angular/core';
import { Art, BuchEntity } from '../../graphql/entities';
import { BookViewComponent } from '../book-view/book-view.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookViewComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent {
  myBook = {
    titel: {
      titel: 'Angular-Buch',
      untertitel: 'Grundlagen und fortgeschrittene Themen',
    },
    isbn: '978-3-8362-7272-8',
    schlagwoerter: ['Angular', 'TypeScript', 'JavaScript'],
    lieferbar: true,
    rating: 5,
    rabatt: '10%',
    homepage: 'https://angular-buch.com',
    preis: 39.9,
    art: Art.HARDCOVER,
    datum: '2021-06-01',
    version: 1,
    id: 1,
  } as BuchEntity;
}
