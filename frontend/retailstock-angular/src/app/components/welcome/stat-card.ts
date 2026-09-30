import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

const TONES = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
};

@Component({
  selector: 'app-stat-card',
  imports: [LucideAngularModule],
  template: `
    <div class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <div
        class="flex h-11 w-11 items-center justify-center rounded-lg"
        [class]="toneClass()"
      >
        <lucide-icon [img]="icon()" class="h-5 w-5" />
      </div>
      <div>
        <p class="text-sm text-slate-500">{{ label() }}</p>
        <p class="text-2xl font-bold text-slate-900">{{ value() }}</p>
      </div>
    </div>
  `,
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input<string | number>('—');
  readonly icon = input.required<LucideIconData>();
  readonly tone = input<keyof typeof TONES>('indigo');

  protected readonly toneClass = computed(() => TONES[this.tone()]);
}
