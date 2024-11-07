import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookListComponent } from './books/components/book-list/book-list.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookListComponent, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-buch-frontend';
}
