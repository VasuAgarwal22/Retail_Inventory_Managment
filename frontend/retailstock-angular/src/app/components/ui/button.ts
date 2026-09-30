import { Component, input } from '@angular/core';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-button',
  imports: [LucideAngularModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      class="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      @if (loading()) {
        <lucide-icon [img]="Spinner" class="h-4 w-4 animate-spin" />
      }
      <ng-content />
    </button>
  `,
})
export class Button {
  readonly type = input<'button' | 'submit'>('button');
  readonly loading = input(false);
  readonly disabled = input(false);

  protected readonly Spinner = LoaderCircle;
}
