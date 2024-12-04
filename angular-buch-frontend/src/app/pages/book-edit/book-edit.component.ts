import { Component, Input } from '@angular/core';
import { BookService } from '../../books/services/book.service';
import { AuthService } from '../../auth/services/auth.service';
import { Buch } from '../../books/models/buch.model';
import { BookFormComponent } from '../../books/components/book-form/book-form.component';
import { Logger } from '../../shared/services/logger.service';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [BookFormComponent],
  templateUrl: './book-edit.component.html',
})
export class BookEditComponent {
  protected book: Buch | undefined;

  constructor(
    private readonly bookService: BookService,
    protected readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Input() set id(bookId: string) {
    this.fetchBookDetails(+bookId);
  }

  fetchBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe((result: { data: { buch: Buch } }) => {
      this.book = result.data.buch;
      this.logger.debug('Fetched book details: ' + this.book.titel.titel);
    });
  }
}
