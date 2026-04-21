import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  paginationItemClasses as classes,
  PaginationItemType,
} from '@mezzanine-ui/core/pagination/paginationItem';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotHorizontalIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTypography } from '@mezzanine-ui/ng/typography';

/**
 * 分頁項目元件，渲染單一頁碼按鈕、省略號或上/下一頁按鈕。
 *
 * 等效 React 的 `PaginationItem` 子元件。
 *
 * @example
 * ```html
 * import { MznPaginationItem } from '@mezzanine-ui/ng/pagination';
 *
 * <div mznPaginationItem [page]="3" [active]="true" (itemClick)="onPageClick(3)" ></div>
 * <div mznPaginationItem type="previous" [disabled]="true" ></div>
 * <div mznPaginationItem type="ellipsis" ></div>
 * ```
 */
@Component({
  selector: '[mznPaginationItem]',
  host: {
    '[attr.active]': 'null',
    '[attr.disabled]': 'null',
    '[attr.page]': 'null',
    '[attr.type]': 'null',
  },
  standalone: true,
  imports: [MznIcon, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (type()) {
      @case ('ellipsis') {
        <div [class]="ellipsisClasses()">
          <i mznIcon [icon]="dotIcon"></i>
        </div>
      }
      @case ('previous') {
        <button
          type="button"
          [class]="buttonClasses()"
          [disabled]="disabled()"
          (click)="onClick()"
        >
          <i mznIcon [icon]="chevronLeftIcon"></i>
        </button>
      }
      @case ('next') {
        <button
          type="button"
          [class]="buttonClasses()"
          [disabled]="disabled()"
          (click)="onClick()"
        >
          <i mznIcon [icon]="chevronRightIcon"></i>
        </button>
      }
      @default {
        <button
          type="button"
          [class]="pageClasses()"
          [disabled]="disabled()"
          [attr.aria-current]="active() || null"
          (click)="onClick()"
          ><span mznTypography variant="label-primary">{{
            page()
          }}</span></button
        >
      }
    }
  `,
})
export class MznPaginationItem {
  /**
   * 是否為目前選中的頁碼。
   * @default false
   */
  readonly active = input(false);

  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 頁碼數字。
   * @default 1
   */
  readonly page = input(1);

  /**
   * 分頁項目類型。
   * @default 'page'
   */
  readonly type = input<PaginationItemType>('page');

  /** 點擊事件（ellipsis 不觸發）。 */
  readonly itemClick = output<void>();

  protected readonly chevronLeftIcon = ChevronLeftIcon;
  protected readonly chevronRightIcon = ChevronRightIcon;
  protected readonly dotIcon = DotHorizontalIcon;

  protected readonly ellipsisClasses = computed((): string =>
    clsx(classes.host, classes.ellipsis, {
      [classes.disabled]: this.disabled(),
    }),
  );

  protected readonly buttonClasses = computed((): string =>
    clsx(classes.host, classes.button, {
      [classes.disabled]: this.disabled(),
    }),
  );

  protected readonly pageClasses = computed((): string =>
    clsx(classes.host, classes.button, {
      [classes.active]: this.active(),
      [classes.disabled]: this.disabled(),
    }),
  );

  protected onClick(): void {
    if (!this.disabled()) {
      this.itemClick.emit();
    }
  }
}
