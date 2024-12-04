import { Component } from '@angular/core';
import { BookFormComponent } from '../../books/components/book-form/book-form.component';

@Component({
  selector: 'app-book-create',
  standalone: true,
  imports: [BookFormComponent],
  templateUrl: './book-create.component.html',
}) // eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BookCreateComponent {}
