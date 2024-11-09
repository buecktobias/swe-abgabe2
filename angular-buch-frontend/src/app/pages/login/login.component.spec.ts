import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { AuthService } from '../../auth/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LoginMeta } from '../../auth/models/login-result.model';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

class MockAuthService {
  login = jasmine.createSpy('login');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: jasmine.SpyObj<Router>;
  let debugElement: DebugElement;

  const getUsernameInput = () => debugElement.query(By.css('input[formControlName="username"]')).nativeElement as HTMLInputElement;
  const getPasswordInput = () => debugElement.query(By.css('input[formControlName="password"]')).nativeElement as HTMLInputElement;
  const getLoginButton = () => debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;

  const setUserLoginInformation = (username: string, password: string) => {
    getUsernameInput().value = username;
    getUsernameInput().dispatchEvent(new Event('input'));
    getPasswordInput().value = password;
    getPasswordInput().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    authService = new MockAuthService();
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the form initially invalid', () => {
    expect(getLoginButton().disabled).toBeTrue();
  });

  it('should enable the submit button when the form is valid', () => {
    setUserLoginInformation('user', 'pass');
    fixture.detectChanges();

    expect(getLoginButton().disabled).toBeFalse();
  });

  it('should have loading set to True after submit', fakeAsync(() => {
    authService.login.and.returnValue(of({ success: true } as LoginMeta).pipe(delay(1000)));

    // Act: Set valid login information and submit the form
    setUserLoginInformation('user', 'pass');
    component.onSubmit();
    fixture.detectChanges();

    expect(getLoginButton().disabled).toBeTrue();
    expect(component.isLoading).toBeTrue();
    tick(1000);
    fixture.detectChanges();

    // Verify loading is set to false after completion
    expect(component.isLoading).toBeFalse();
  }));

  it('should navigate on successful login', () => {
    authService.login.and.returnValue(of({ success: true } as LoginMeta));
    setUserLoginInformation('user', 'pass');

    getLoginButton().click();
    fixture.detectChanges();
    /* eslint-disable @typescript-eslint/unbound-method */
    expect(router.navigate).toHaveBeenCalled();
  });
});
