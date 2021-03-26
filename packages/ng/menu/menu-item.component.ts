import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  menuItemClasses as classes,
} from '@mezzanine-ui/core/menu';
import { CheckIcon } from '@mezzanine-ui/icons';
import {
  BooleanInput,
  HostBindingClass,
  InputBoolean,
} from '@mezzanine-ui/ng/cdk';

@Component({
  selector: 'li[mzn-menu-item]',
  exportAs: 'mznMenuItem',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #activeIcon>
      <ng-container *ngIf="active">
        <i
          [class]="classes.activeIcon"
          [mzn-icon]="checkIcon"
        ></i>
      </ng-container>
    </ng-template>

    <div [class]="classes.label">
      <ng-content></ng-content>
    </div>
    <ng-template [ngTemplateOutlet]="activeIcon"></ng-template>

  `,
})

/**
 * The ng component for `mezzanine` menu item.
 */
export class MznMenuItemComponent {
  static ngAcceptInputType_active: BooleanInput;

  static ngAcceptInputType_disabled: BooleanInput;

  @HostBindingClass(classes.host)
  readonly bindHostClass = true;

  readonly classes = classes;

  readonly checkIcon = CheckIcon;

  /**
   * Whether the menu item is active.
   * @default false
   */
  @HostBindingClass(classes.active)
  @Input()
  @InputBoolean()
  active?: boolean = false;

  /**
   * Whether the menu item is disabled.
   * @default false
   */
  @HostBindingClass(classes.disabled)
  @HostBinding('attr.aria-disabled')
  @Input()
  @InputBoolean()
  disabled?: boolean = false;

  /**
   * The role of menu item.
   * @default 'menuitem'
   */
  @HostBinding('attr.role')
  @Input()
  role?: string = 'menuitem';

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled) {
      if (event.target instanceof HTMLAnchorElement) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
  }
}
