import { Component, computed, input } from '@angular/core';
import { CircleAlert, CircleCheck, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-alert',
  imports: [LucideAngularModule],
  template: `
    @if (message()) {
      <div
        role="alert"
        class="flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
        [class]="
          isError()
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        "
      >
        <lucide-icon [img]="icon()" class="mt-0.5 h-4 w-4 shrink-0" />
        <span>{{ message() }}</span>
      </div>
    }
  `,
})
export class Alert {
  readonly type = input<'error' | 'success'>('error');
  readonly message = input<string | null | undefined>('');

  protected readonly isError = computed(() => this.type() === 'error');
  protected readonly icon = computed(() => (this.isError() ? CircleAlert : CircleCheck));
}
