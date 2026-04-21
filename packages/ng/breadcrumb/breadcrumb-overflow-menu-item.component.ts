import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { breadcrumbOverflowMenuItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { MznTypography } from '@mezzanine-ui/ng/typography';

/**
 * Breadcrumb overflow menu 展開後的單一項目。
 *
 * 由 `MznBreadcrumbOverflowMenu` 內部渲染，不建議獨立使用。
 * 提供 `href` 時渲染為 `<a>`，否則為可點擊的 `<span>`。
 *
 * @internal
 */
@Component({
  selector: '[mznBreadcrumbOverflowMenuItem]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTypography],
  host: {
    '[class]': 'hostClass',
    '[attr.href]': 'null',
    '[attr.name]': 'null',
    '[attr.target]': 'null',
  },
  template: `
    @if (href()) {
      <a
        [class]="triggerClass"
        [href]="href()"
        [target]="target() ?? null"
        (click)="handleClick()"
      >
        <span mznTypography variant="label-primary">{{ name() }}</span>
      </a>
    } @else {
      <span [class]="triggerClass" (click)="handleClick()">
        <span mznTypography variant="label-primary">{{ name() }}</span>
      </span>
    }
  `,
})
export class MznBreadcrumbOverflowMenuItem {
  protected readonly hostClass = classes.host;
  protected readonly triggerClass = classes.trigger;

  /** 連結目標。 */
  readonly href = input<string>();

  /** 項目名稱。 */
  readonly name = input.required<string>();

  /** 連結 target 屬性。 */
  readonly target = input<string>();

  /** 點擊事件。 */
  readonly itemClick = output<void>();

  protected handleClick(): void {
    this.itemClick.emit();
  }
}
