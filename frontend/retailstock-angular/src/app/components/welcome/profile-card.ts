import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, Mail, Phone, ShieldCheck } from 'lucide-angular';
import { User } from '../../core/api.service';

@Component({
  selector: 'app-profile-card',
  imports: [LucideAngularModule],
  template: `
    <section class="rounded-xl border border-slate-200 bg-white p-5">
      <h2 class="mb-4 text-lg font-semibold text-slate-900">Your profile</h2>

      <dl class="space-y-3 text-sm">
        <div class="flex items-center gap-3">
          <lucide-icon [img]="MailIcon" class="h-4 w-4 text-slate-400" />
          <dd class="text-slate-700">{{ user()?.email ?? email() }}</dd>
        </div>
        @if (user()?.phoneNo; as phone) {
          <div class="flex items-center gap-3">
            <lucide-icon [img]="PhoneIcon" class="h-4 w-4 text-slate-400" />
            <dd class="text-slate-700">{{ phone }}</dd>
          </div>
        }
        <div class="flex items-start gap-3">
          <lucide-icon [img]="ShieldIcon" class="mt-0.5 h-4 w-4 text-slate-400" />
          <dd class="flex flex-wrap gap-1.5">
            @for (r of roles(); track r) {
              <span class="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                {{ r.replaceAll('_', ' ') }}
              </span>
            } @empty {
              <span class="text-slate-500">No roles assigned</span>
            }
          </dd>
        </div>
      </dl>
    </section>
  `,
})
export class ProfileCard {
  readonly user = input<User | null>(null);
  readonly email = input<string | null>('');

  protected readonly MailIcon = Mail;
  protected readonly PhoneIcon = Phone;
  protected readonly ShieldIcon = ShieldCheck;
  protected readonly roles = computed(() => [...(this.user()?.roles ?? [])]);
}
