import { Component } from '@angular/core';
import { Package, TriangleAlert, Truck, Warehouse } from 'lucide-angular';
import { StatCard } from './stat-card';

// TODO: replace the "—" placeholders with real numbers once you add
// count/summary endpoints to the backend.
@Component({
  selector: 'app-stats-grid',
  imports: [StatCard],
  template: `
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <app-stat-card label="Total products" [icon]="PackageIcon" tone="indigo" />
      <app-stat-card label="Warehouses" [icon]="WarehouseIcon" tone="emerald" />
      <app-stat-card label="Suppliers" [icon]="TruckIcon" tone="amber" />
      <app-stat-card label="Low stock items" [icon]="AlertIcon" tone="rose" />
    </section>
  `,
})
export class StatsGrid {
  protected readonly PackageIcon = Package;
  protected readonly WarehouseIcon = Warehouse;
  protected readonly TruckIcon = Truck;
  protected readonly AlertIcon = TriangleAlert;
}
