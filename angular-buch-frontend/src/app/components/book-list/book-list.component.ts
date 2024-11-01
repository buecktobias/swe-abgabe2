import { Component } from '@angular/core';
import { BuchEntity } from '../../graphql/entities';
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
  } as BuchEntity;
}
