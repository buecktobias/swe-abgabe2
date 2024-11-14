import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { faBarcode, faBook, faCheck, faEuroSign, faExternalLinkAlt, faStar, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Buch } from '../../models/buch.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-book-view',
  standalone: true,
  imports: [FontAwesomeModule, StarRatingComponent, RouterLink],
  templateUrl: './book-view.component.html',
})
export class BookViewComponent {
  @Input({ required: true }) book: Buch | undefined;
  faBook = faBook;
  faBarcode = faBarcode;
  faEuroSign = faEuroSign;
  faStar = faStar;
  faCheck = faCheck;
  faTimes = faTimes;
  faExternalLinkAlt = faExternalLinkAlt;

  isExpanded = false;
}
