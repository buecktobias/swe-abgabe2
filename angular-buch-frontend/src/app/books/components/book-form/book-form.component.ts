import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Buch } from '../../models/buch.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
})
export class BookFormComponent {
  @Input() book: Buch | undefined;
  @Input() isEditMode = false;
  @Output() submitForm = new EventEmitter<any>();

  handleSubmit() {
    this.submitForm.emit(this.book);
  }
}
