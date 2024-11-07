import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../auth/services/token.service';

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

  constructor(private readonly tokenService: TokenService) {}

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
      this.tokenService.login(username ?? '', password ?? '').subscribe({
        next: () => {
          this.loginMessage = 'Login successful';
          console.log('Login successful');
        },
        error: () => {
          this.loginMessage = 'Login failed';
          console.error('Login failed');
        },
      });
    }
  }
}
