import { Component, Input } from '@angular/core';
import { BuchEntity } from '../../graphql/entities';

@Component({
  selector: 'app-book-view',
  standalone: true,
  imports: [],
  templateUrl: './book-view.component.html',
  styleUrl: './book-view.component.scss',
})
export class BookViewComponent {
  @Input({ required: true }) book: BuchEntity | undefined;
}
