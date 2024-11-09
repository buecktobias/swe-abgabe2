import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { LoginErrorType, LoginMeta } from '../../auth/models/login-result.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected readonly username = new FormControl<string>('', { nonNullable: true, validators: [(control) => Validators.required(control)] });
  protected readonly password = new FormControl<string>('', { nonNullable: true, validators: [(control) => Validators.required(control)] });
  protected loginMessage = '';
  protected readonly loginForm = new FormGroup({
    username: this.username,
    password: this.password,
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }
    const { username, password } = this.loginForm.value as { username: string; password: string };
    this.authService.login({ username: username, password: password }).subscribe((loginMeta: LoginMeta) => {
      if (loginMeta.success) {
        void this.router.navigate(['/']);
      } else if (loginMeta.errorType === LoginErrorType.WRONG_INPUT) {
        this.loginMessage = loginMeta.message;
      } else {
        this.loginMessage = 'An Application Error occurred. Please try again later.';
      }
    });
  }
}
