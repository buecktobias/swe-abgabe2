import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { BookDetailViewComponent } from './pages/book-detail-view/book-detail-view.component';
import { BookEditComponent } from './pages/book-edit/book-edit.component';
import { BookCreateComponent } from './pages/book-create/book-create.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, { path: 'book/:id/view', component: BookDetailViewComponent }, {
    path: 'book/:id/edit',
    component: BookEditComponent,
  }, { path: 'book/create', component: BookCreateComponent },
];
