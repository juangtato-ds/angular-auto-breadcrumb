import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-integrations-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './integrations-page.component.html',
  styleUrl: './integrations-page.component.scss'
})
export class IntegrationsPageComponent {

}
