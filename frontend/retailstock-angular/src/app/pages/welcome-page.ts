import { Component, computed, inject, signal } from '@angular/core';
import { Navbar } from '../components/layout/navbar';
import { Sidebar } from '../components/layout/sidebar';
import { ProfileCard } from '../components/welcome/profile-card';
import { QuickActions } from '../components/welcome/quick-actions';
import { StatsGrid } from '../components/welcome/stats-grid';
import { WelcomeBanner } from '../components/welcome/welcome-banner';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-welcome-page',
  imports: [Navbar, Sidebar, WelcomeBanner, StatsGrid, QuickActions, ProfileCard],
  template: `
    <div class="flex min-h-screen flex-col bg-slate-50">
      <app-navbar
        [name]="fullName()"
        [email]="auth.email()"
        (logout)="auth.logout()"
        (menuClick)="menuOpen.set(true)"
      />

      <div class="flex flex-1">
        <app-sidebar [open]="menuOpen()" (close)="menuOpen.set(false)" />

        <main class="flex-1 space-y-6 p-4 sm:p-6">
          <app-welcome-banner [name]="auth.user()?.firstName" />
          <app-stats-grid />

          <div class="grid gap-6 xl:grid-cols-3">
            <div class="xl:col-span-2">
              <app-quick-actions />
            </div>
            <app-profile-card [user]="auth.user()" [email]="auth.email()" />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class WelcomePage {
  protected readonly auth = inject(AuthService);
  protected readonly menuOpen = signal(false);

  protected readonly fullName = computed(() => {
    const u = this.auth.user();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });
}
