import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { AuthPage } from './pages/auth-page';
import { WelcomePage } from './pages/welcome-page';

export const routes: Routes = [
  { path: '', component: WelcomePage, canActivate: [authGuard] },
  { path: 'auth', component: AuthPage, canActivate: [guestGuard] },
  { path: '**', redirectTo: '' },
];
