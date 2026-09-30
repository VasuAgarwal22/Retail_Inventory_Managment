import { Component } from '@angular/core';
import { Boxes, LucideAngularModule, ScanBarcode, Truck, Warehouse } from 'lucide-angular';

@Component({
  selector: 'app-auth-brand-panel',
  imports: [LucideAngularModule],
  template: `
    <div
      class="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-10 text-white lg:flex"
    >
      <div class="flex items-center gap-2 text-lg font-bold">
        <lucide-icon [img]="BoxesIcon" class="h-6 w-6" />
        RetailStock
      </div>

      <div>
        <h1 class="text-3xl font-bold leading-tight">
          Retail inventory,
          <br />
          finally under control.
        </h1>
        <ul class="mt-8 space-y-4">
          @for (f of features; track f.text) {
            <li class="flex items-center gap-3 text-indigo-100">
              <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <lucide-icon [img]="f.icon" class="h-4 w-4" />
              </span>
              {{ f.text }}
            </li>
          }
        </ul>
      </div>

      <p class="text-xs text-indigo-200">© {{ year }} Retail Inventory Management</p>
    </div>
  `,
})
export class AuthBrandPanel {
  protected readonly BoxesIcon = Boxes;
  protected readonly year = new Date().getFullYear();
  protected readonly features = [
    { icon: Boxes, text: 'Track stock across every product variant' },
    { icon: Warehouse, text: 'Manage warehouses and storage locations' },
    { icon: Truck, text: 'Keep suppliers and purchasing in one place' },
    { icon: ScanBarcode, text: 'Full history of every stock movement' },
  ];
}
