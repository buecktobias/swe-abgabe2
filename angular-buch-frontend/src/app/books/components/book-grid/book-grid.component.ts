import { Component, OnInit } from '@angular/core';
import { BookViewComponent } from '../book-view/book-view.component';
import { BookService } from '../../services/book.service';
import { Buch } from '../../models/buch.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookViewComponent],
  templateUrl: './book-grid.component.html',
})
export class BookGridComponent implements OnInit {
  books: Buch[] = [];

  constructor(private readonly bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe((result: { data: { buecher: Buch[] } }) => {
      this.books = result.data.buecher;
    });
  }
}
