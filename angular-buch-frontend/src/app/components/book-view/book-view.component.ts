import { Component, Input } from '@angular/core';

import { Buch } from '../../graphql/buch.model';

@Component({
  selector: 'app-book-view',
  standalone: true,
  imports: [],
  templateUrl: './book-view.component.html',
  styleUrl: './book-view.component.scss',
})
export class BookViewComponent {
  @Input({ required: true }) book: Buch | undefined;
}
