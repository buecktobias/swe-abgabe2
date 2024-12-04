import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Buch } from '../../models/buch.model';
import { Art } from '../../models/art.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class BookFormComponent implements OnInit {
  @Input() book: Buch | null = null;
  art = new FormControl<Art | null>(null);
  preis = new FormControl<number | null>(null, [Validators.min(0)]);
  lieferbar = new FormControl<boolean | null>(null);
  datum = new FormControl<string | null>(null, [(control) => Validators.required(control)]);
  homepage = new FormControl<string | null>(null, [Validators.pattern('https?://.+')]);
  schlagwoerter = new FormControl<string[] | null>(null);
  id = new FormControl<number | null>({ value: null, disabled: true });
  version = new FormControl<number | null>(null);
  titel = new FormControl<string | null>(null);
  subTitel = new FormControl<string | null>(null);
  rabatt = new FormControl<string | null>(null);
  bookForm: FormGroup;
  private readonly minIsbnLength = 10;
  isbn = new FormControl<string | null>('', [(control) => Validators.required(control), Validators.minLength(this.minIsbnLength)]);
  private readonly maxRating = 5;
  rating = new FormControl<number | null>(null, [Validators.min(0), Validators.max(this.maxRating)]);

  constructor() {
    this.bookForm = new FormGroup({
      isbn: this.isbn,
      rating: this.rating,
      art: this.art,
      preis: this.preis,
      lieferbar: this.lieferbar,
      datum: this.datum,
      homepage: this.homepage,
      schlagwoerter: this.schlagwoerter,
      id: this.id,
      version: this.version,
      titel: this.titel,
      subTitel: this.subTitel,
      rabatt: this.rabatt,
    });
  }

  ngOnInit(): void {
    if (this.book) {
      console.log('Book:', this.book);
      this.bookForm.patchValue({
        isbn: this.book.isbn,
        titel: this.book.titel.titel,
        subTitel: this.book.titel.untertitel,
        schlagwoerter: this.book.schlagwoerter,
        homepage: this.book.homepage,
        id: this.book.id,
        version: this.book.version,
        rating: this.book.rating,
        art: this.book.art,
        preis: this.book.preis,
        lieferbar: this.book.lieferbar,
        datum: this.book.datum,
        rabatt: this.book.rabatt,
      });
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      console.log('Updated Buch');
    }
  }
}
