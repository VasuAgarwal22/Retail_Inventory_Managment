import { Component, computed, input, output } from '@angular/core';
import { Boxes, LogOut, LucideAngularModule, Menu } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule],
  template: `
    <header
      class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6"
    >
      <div class="flex items-center gap-3">
        <button
          (click)="menuClick.emit()"
          class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <lucide-icon [img]="MenuIcon" class="h-5 w-5" />
        </button>
        <div class="flex items-center gap-2 font-bold text-slate-900">
          <lucide-icon [img]="BoxesIcon" class="h-6 w-6 text-indigo-600" />
          RetailStock
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden text-right sm:block">
          <p class="text-sm font-semibold text-slate-900">{{ name() || 'User' }}</p>
          <p class="text-xs text-slate-500">{{ email() }}</p>
        </div>
        <div
          class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700"
        >
          {{ initial() }}
        </div>
        <button
          (click)="logout.emit()"
          class="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <lucide-icon [img]="LogOutIcon" class="h-4 w-4" />
          <span class="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  `,
})
export class Navbar {
  readonly name = input('');
  readonly email = input<string | null>('');
  readonly logout = output<void>();
  readonly menuClick = output<void>();

  protected readonly MenuIcon = Menu;
  protected readonly BoxesIcon = Boxes;
  protected readonly LogOutIcon = LogOut;

  protected readonly initial = computed(() =>
    (this.name() || this.email() || '?').charAt(0).toUpperCase(),
  );
}
