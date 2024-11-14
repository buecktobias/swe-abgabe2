import { Component } from '@angular/core';
import { BookGridComponent } from '../../books/components/book-grid/book-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookGridComponent],
  templateUrl: './home.component.html',
}) // eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HomeComponent {}
