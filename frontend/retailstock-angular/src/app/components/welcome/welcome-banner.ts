import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-welcome-banner',
  imports: [LucideAngularModule],
  template: `
    <section
      class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8"
    >
      <lucide-icon [img]="SparklesIcon" class="absolute -right-4 -top-4 h-32 w-32 text-white/10" />
      <p class="text-sm font-medium text-indigo-100">{{ greeting() }}</p>
      <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Welcome{{ name() ? ', ' + name() : '' }} 👋</h1>
      <p class="mt-2 max-w-xl text-sm text-indigo-100">
        You're signed in to the Retail Inventory Management system. Use the shortcuts below to start
        managing your stock.
      </p>
    </section>
  `,
})
export class WelcomeBanner {
  readonly name = input<string | null | undefined>('');

  protected readonly SparklesIcon = Sparkles;
  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  });
}
