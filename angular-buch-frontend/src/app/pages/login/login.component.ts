import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  protected readonly username = new FormControl<string>('', { nonNullable: true, validators: [(control) => Validators.required(control)] });
  protected readonly password = new FormControl<string>('', { nonNullable: true, validators: [(control) => Validators.required(control)] });
  protected loginMessage = '';
  protected loading = false;
  protected readonly loginForm = new FormGroup({
    username: this.username,
    password: this.password,
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  get isLoading(): boolean {
    return this.loading;
  }

  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  get currentUsername(): string {
    return this.username.value;
  }

  get currentPassword(): string {
    return this.password.value;
  }

  get currentLoginMessage(): string {
    return this.loginMessage;
  }

  ngOnInit(): void {
    this.username.valueChanges.subscribe(() => (this.loginMessage = ''));
    this.password.valueChanges.subscribe(() => (this.loginMessage = ''));
  }
  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }
    this.loading = true;
    const { username, password } = this.loginForm.value as { username: string; password: string };
    this.authService.login({ username, password }).subscribe({
      next: (loginMeta: LoginMeta) => {
        if (loginMeta.success) {
          void this.router.navigate(['/']);
        } else if (loginMeta.errorType === LoginErrorType.WRONG_INPUT) {
          this.loginMessage = loginMeta.message;
        } else {
          this.loginMessage = 'An Application Error occurred. Please try again later.';
        }
      },
      error: () => {
        this.loginMessage = 'An Application Error occurred. Please try again later.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
