import { Component, output } from '@angular/core';
import { ArrowRight, LucideAngularModule, Package, Tags, Truck, Warehouse } from 'lucide-angular';

@Component({
  selector: 'app-quick-actions',
  imports: [LucideAngularModule],
  template: `
    <section>
      <h2 class="mb-3 text-lg font-semibold text-slate-900">Quick actions</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        @for (a of actions; track a.title) {
          <button
            (click)="selected.emit(a.title)"
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-sm"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
            >
              <lucide-icon [img]="a.icon" class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-slate-900">{{ a.title }}</p>
              <p class="mt-0.5 text-sm text-slate-500">{{ a.desc }}</p>
            </div>
            <lucide-icon
              [img]="ArrowRightIcon"
              class="mt-1 h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
            />
          </button>
        }
      </div>
    </section>
  `,
})
export class QuickActions {
  readonly selected = output<string>();

  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly actions = [
    { title: 'Manage products', desc: 'Add, edit and review your product catalogue.', icon: Package },
    { title: 'Categories & brands', desc: 'Organise products into categories and brands.', icon: Tags },
    { title: 'Warehouses', desc: 'View warehouses and their storage locations.', icon: Warehouse },
    { title: 'Suppliers', desc: 'Maintain suppliers and what they provide.', icon: Truck },
  ];
}
