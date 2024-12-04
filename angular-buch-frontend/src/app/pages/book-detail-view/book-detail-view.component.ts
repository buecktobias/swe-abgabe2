import { Component, Input } from '@angular/core';
import { Buch } from '../../books/models/buch.model';
import { BookService } from '../../books/services/book.service';
import { StarRatingComponent } from '../../books/components/star-rating/star-rating.component';
import { AuthService } from '../../auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-detail-view',
  standalone: true,
  imports: [StarRatingComponent, RouterLink],
  templateUrl: './book-detail-view.component.html',
})
export class BookDetailViewComponent {
  book: Buch | undefined;

  constructor(
    private readonly bookService: BookService,
    protected readonly authService: AuthService,
  ) {}

  @Input() set id(bookId: string) {
    this.fetchBookDetails(+bookId);
  }

  fetchBookDetails(id: number): void {
    this.bookService.getBookById(id).subscribe((result: { data: { buch: Buch } }) => {
      this.book = result.data.buch;
    });
  }

  onEdit(): void {
    console.log('Edit book');
  }

  onDelete(): void {
    console.log('Delete book');
  }

  onCreate(): void {
    console.log('Create book');
  }
}
