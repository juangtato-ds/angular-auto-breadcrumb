import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private router = inject(Router);

  startSession(): void {
    sessionStorage.setItem('session', 'tengo-session');
    this.router.navigateByUrl('/');
  }

}
