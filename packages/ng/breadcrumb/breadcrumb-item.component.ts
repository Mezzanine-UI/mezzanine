import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import clsx from 'clsx';

/**
 * 麵包屑項目元件，代表路徑中的單一層級。
 *
 * 可設為連結（提供 `href`）或純文字（`current` 為 true）。
 * 通常不需單獨使用，由 `MznBreadcrumb` 內部渲染。
 *
 * @example
 * ```html
 * <mzn-breadcrumb-item name="首頁" href="/" />
 * <mzn-breadcrumb-item name="目前頁面" [current]="true" />
 * ```
 */
@Component({
  selector: 'mzn-breadcrumb-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    @if (!current() && href()) {
      <a
        [class]="triggerClass"
        [href]="href()"
        [target]="target()"
        (click)="onClick($event)"
      >
        <span>{{ name() }}</span>
      </a>
    } @else {
      <span [class]="triggerClass">
        <span>{{ name() }}</span>
      </span>
    }
  `,
})
export class MznBreadcrumbItem {
  protected readonly triggerClass = classes.trigger;

  /**
   * 是否為目前頁面。
   * @default false
   */
  readonly current = input(false);

  /** 連結目標。 */
  readonly href = input<string>();

  /** 項目名稱。 */
  readonly name = input.required<string>();

  /** 連結 target 屬性。 */
  readonly target = input<string>();

  /** 點擊事件。 */
  readonly itemClick = output<void>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.current]: this.current(),
    }),
  );

  protected onClick(_event: MouseEvent): void {
    this.itemClick.emit();
  }
}
