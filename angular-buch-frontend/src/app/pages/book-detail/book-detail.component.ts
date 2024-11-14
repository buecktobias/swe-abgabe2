import { Component, Input } from '@angular/core';
import { Buch } from '../../books/models/buch.model';
import { BookService } from '../../books/services/book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [],
  templateUrl: './book-detail.component.html',
})
export class BookDetailComponent {
  protected book: Buch | undefined;

  constructor(private readonly bookService: BookService) {}

  @Input() set id(bookId: string) {
    this.fetchBookDetails(+bookId);
  }

  fetchBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe((result: { data: { buch: Buch } }) => {
      this.book = result.data.buch;
    });
  }
}
