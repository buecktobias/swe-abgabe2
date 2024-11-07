import { Component, Input } from '@angular/core';

import { Buch } from '../../models/buch.model';

@Component({
  selector: 'app-book-view',
  standalone: true,
  imports: [],
  templateUrl: './book-view.component.html',
})
export class BookViewComponent {
  @Input({ required: true }) book: Buch | undefined;
}
