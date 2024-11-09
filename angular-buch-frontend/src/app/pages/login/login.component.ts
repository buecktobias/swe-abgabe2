import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { LoginMeta } from '../../auth/models/login-result.model';

interface LoginForm {
  username: FormControl<string>;
  password?: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  loginMessage = 'Please log in';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup<LoginForm>({
      username: new FormControl('', { nonNullable: true }),
      password: new FormControl('', { nonNullable: true }),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log('Login attempt:', username, password);
      this.authService.login({ username: username ?? '', password: password ?? '' }).subscribe({
        next: (loginMeta: LoginMeta) => {
          if (loginMeta.success) {
            void this.router.navigate(['/']);
          }
          this.loginMessage = loginMeta.message;
        },
        error: () => {
          this.loginMessage = 'Login failed';
          console.error('Login failed');
        },
      });
    }
  }
}
