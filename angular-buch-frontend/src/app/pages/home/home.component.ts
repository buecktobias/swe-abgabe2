import { Component } from '@angular/core';
import { BookListComponent } from '../../books/components/book-list/book-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookListComponent],
  templateUrl: './home.component.html',
}) // eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HomeComponent {}
