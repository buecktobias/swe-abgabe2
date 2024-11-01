import { Component, OnInit } from '@angular/core';
import { GetBookByIdGQL } from '../../services/books/queries/get-book-by-id.gql';
import { BuchEntity } from '../../graphql/entities';

@Component({
  selector: 'app-book-view-by-id',
  standalone: true,
  imports: [],
  templateUrl: './book-view-by-id.component.html',
  styleUrl: './book-view-by-id.component.scss',
})
export class BookViewByIdComponent implements OnInit {
  id = 1;
  protected book: BuchEntity | undefined;

  constructor(private bookByIdGQL: GetBookByIdGQL) {}

  // Use the service in lifecycle hooks or methods
  ngOnInit(): void {
    this.bookByIdGQL
      .watch({ id: this.id }) // Pass the ID variable
      .valueChanges.subscribe({
        next: (result) => {
          this.book = result.data.buch;
        },
        error: (error) => {
          console.error('Error fetching book details:', error);
        },
      });
  }
}
