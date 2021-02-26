import { tagClasses as classes, TagSize } from '@mezzanine-ui/core/tag';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  BooleanInput,
  HostBindingClass,
  HostBindingEnumClass,
  InputBoolean,
} from '@mezzanine-ui/ng/cdk';

/**
 * The ng component for `mezzanine` tag.
 */
@Component({
  selector: 'mzn-tag',
  exportAs: 'mznTag',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span [class]="classes.label">
      <ng-content></ng-content>
    </span>
    <i
      *ngIf="closable"
      [mzn-icon]="closeIcon"
      [class]="classes.closeIcon"
      (click)="onClose($event)"
      tabIndex="-1"
    ></i>
  `,
})
export class MznTagComponent {
  static ngAcceptInputType_closable: BooleanInput;

  static ngAcceptInputType_disabled: BooleanInput;

  @HostBindingClass(classes.host)
  readonly bindHostClass = true;

  readonly classes = classes;

  readonly closeIcon = TimesIcon;

  /**
   * Whether the tag can be closed.
   * @default false
   */
  @Input()
  @InputBoolean()
  closable = false;

  /**
   * Whether the tag disabled.
   * @default false
   */
  @HostBinding('attr.aria-disabled')
  @HostBindingClass(classes.disabled)
  @Input()
  @InputBoolean()
  disabled = false;

  /**
   * The size of the tag.
   * @default 'medium'
   */
  @HostBindingEnumClass(classes.size, [
    'small',
    'medium',
    'large',
  ])
  @Input()
  size: TagSize = 'medium';

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output()
  readonly close = new EventEmitter<MouseEvent>();

  onClose(event: MouseEvent) {
    if (!this.disabled) {
      this.close.emit(event);
    }
  }
}
