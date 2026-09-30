import { Component, input, output } from '@angular/core';
import {
  Boxes,
  LayoutDashboard,
  LucideAngularModule,
  Package,
  Tags,
  Truck,
  Users,
  Warehouse,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  template: `
    <!-- mobile backdrop -->
    @if (open()) {
      <div class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" (click)="close.emit()"></div>
    }

    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:z-auto lg:translate-x-0"
      [class.translate-x-0]="open()"
      [class.-translate-x-full]="!open()"
    >
      <div class="mb-6 flex items-center justify-between lg:hidden">
        <div class="flex items-center gap-2 font-bold text-slate-900">
          <lucide-icon [img]="BoxesIcon" class="h-6 w-6 text-indigo-600" />
          RetailStock
        </div>
        <button (click)="close.emit()" class="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Close menu">
          <lucide-icon [img]="XIcon" class="h-5 w-5" />
        </button>
      </div>

      <nav class="space-y-1">
        @for (link of links; track link.label) {
          <button
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
            [class]="
              link.active
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            "
          >
            <lucide-icon [img]="link.icon" class="h-4 w-4" />
            {{ link.label }}
          </button>
        }
      </nav>
    </aside>
  `,
})
export class Sidebar {
  readonly open = input(false);
  readonly close = output<void>();

  protected readonly BoxesIcon = Boxes;
  protected readonly XIcon = X;
  protected readonly links = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true },
    { label: 'Products', icon: Package, active: false },
    { label: 'Categories & Brands', icon: Tags, active: false },
    { label: 'Warehouses', icon: Warehouse, active: false },
    { label: 'Suppliers', icon: Truck, active: false },
    { label: 'Users', icon: Users, active: false },
  ];
}
