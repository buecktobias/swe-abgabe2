import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookService } from '../../services/book.service';
import { Buch } from '../../models/buch.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true, imports: [BookCardComponent, RouterLink],
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
