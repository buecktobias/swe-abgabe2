import { Component, OnInit } from '@angular/core';
import { BookViewComponent } from '../book-view/book-view.component';
import { BookService } from '../../services/books/book.service';
import { Buch } from '../../graphql/buch.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookViewComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  books: Buch[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe((result: { data: { buecher: Buch[] } }) => {
      this.books = result.data.buecher;
    });
  }
}
