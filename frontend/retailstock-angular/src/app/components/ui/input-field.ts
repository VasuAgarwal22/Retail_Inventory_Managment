import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Eye, EyeOff, LucideAngularModule, LucideIconData } from 'lucide-angular';

/** Form-control compatible input: use with formControlName / [formControl]. */
@Component({
  selector: 'app-input-field',
  imports: [LucideAngularModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputField), multi: true },
  ],
  template: `
    <div>
      <label [attr.for]="id()" class="mb-1.5 block text-sm font-medium text-slate-700">
        {{ label() }}
      </label>
      <div class="relative">
        @if (icon(); as ico) {
          <lucide-icon
            [img]="ico"
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
        }
        <input
          [id]="id()"
          [name]="name()"
          [type]="isPassword() && show() ? 'text' : type()"
          [placeholder]="placeholder()"
          [attr.autocomplete]="autocomplete()"
          [value]="value()"
          [disabled]="isDisabled()"
          (input)="onInput($event)"
          (blur)="onTouched()"
          class="w-full rounded-lg border bg-white py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2"
          [class.pl-10]="icon()"
          [class.pl-3]="!icon()"
          [class.pr-10]="isPassword()"
          [class.pr-3]="!isPassword()"
          [class]="
            error()
              ? 'border-red-400 focus:ring-red-200'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
          "
        />
        @if (isPassword()) {
          <button
            type="button"
            (click)="show.set(!show())"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            [attr.aria-label]="show() ? 'Hide password' : 'Show password'"
          >
            <lucide-icon [img]="show() ? EyeOffIcon : EyeIcon" class="h-4 w-4" />
          </button>
        }
      </div>
      @if (error()) {
        <p class="mt-1 text-xs text-red-600">{{ error() }}</p>
      }
    </div>
  `,
})
export class InputField implements ControlValueAccessor {
  readonly id = input.required<string>();
  readonly name = input('');
  readonly label = input('');
  readonly icon = input<LucideIconData | null>(null);
  readonly type = input<'text' | 'email' | 'password' | 'tel'>('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string | null>(null);
  readonly error = input<string | null | undefined>('');

  protected readonly EyeIcon = Eye;
  protected readonly EyeOffIcon = EyeOff;

  protected readonly show = signal(false);
  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);

  protected isPassword() {
    return this.type() === 'password';
  }

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }
}
