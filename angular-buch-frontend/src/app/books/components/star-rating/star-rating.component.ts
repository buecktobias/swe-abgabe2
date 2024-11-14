import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './star-rating.component.html',
})
export class StarRatingComponent implements OnInit {
  @Input({ required: true }) rating = 0;
  protected faStarSolid = faStarSolid;
  protected faStarRegular = faStarRegular;

  protected starIndexes: number[] = Array.from({ length: 5 }, (_, i) => i++);
  private readonly maxRating = 5;

  ngOnInit() {
    if (this.rating < 0 || this.rating > this.maxRating || Math.round(this.rating) !== this.rating) {
      throw new Error('Rating must be between 0 and 5');
    }
  }
}
