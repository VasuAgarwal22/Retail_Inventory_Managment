// This file is no longer used - routing now goes through layout-page.ts
// Kept for compatibility, redirects to dashboard
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class WelcomePage { }
