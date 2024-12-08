import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookGridComponent } from './books/components/book-grid/book-grid.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookGridComponent, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-buch-frontend';
}
