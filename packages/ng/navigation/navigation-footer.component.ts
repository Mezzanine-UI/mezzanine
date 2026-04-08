import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { navigationFooterClasses as classes } from '@mezzanine-ui/core/navigation';
import clsx from 'clsx';
import {
  MZN_NAVIGATION_ACTIVATED,
  NavigationActivatedState,
} from './navigation-context';

/**
 * 導覽列底部元件。
 *
 * @example
 * ```html
 * <mzn-navigation-footer>
 *   <button>設定</button>
 * </mzn-navigation-footer>
 * ```
 */
@Component({
  selector: 'mzn-navigation-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <ng-content />
    <span [class]="iconsClass">
      <ng-content select="[icons]" />
    </span>
  `,
})
export class MznNavigationFooter {
  private readonly navState = inject<NavigationActivatedState>(
    MZN_NAVIGATION_ACTIVATED,
    { optional: true },
  );

  protected readonly iconsClass = classes.icons;

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.collapsed]: this.navState?.collapsed,
    }),
  );
}
