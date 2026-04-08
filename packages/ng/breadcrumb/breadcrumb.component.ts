import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { breadcrumbClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { SlashIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznBreadcrumbItem } from './breadcrumb-item.component';

/** 麵包屑資料項目介面。 */
export interface BreadcrumbItemData {
  /** 是否為目前頁面。 */
  readonly current?: boolean;
  /** 連結目標。 */
  readonly href?: string;
  /** 項目唯一識別碼。 */
  readonly id?: string;
  /** 項目名稱。 */
  readonly name: string;
  /** 點擊回呼。 */
  readonly onClick?: () => void;
  /** 連結 target 屬性。 */
  readonly target?: string;
}

/**
 * 麵包屑導覽元件，顯示頁面在階層中的位置。
 *
 * 透過 `items` 輸入以資料驅動方式渲染，自動處理分隔線。
 * 最後一個項目自動標記為 `current`。
 *
 * 當 `condensed` 為 `true` 時，僅顯示最後一個項目及其父層項目；
 * 中間項目的展開下拉選單（overflow menu）預計後續版本實作。
 *
 * @example
 * ```html
 * import { MznBreadcrumb } from '@mezzanine-ui/ng/breadcrumb';
 *
 * <mzn-breadcrumb [items]="[
 *   { name: '首頁', href: '/' },
 *   { name: '產品', href: '/products' },
 *   { name: '目前頁面' }
 * ]" />
 *
 * <mzn-breadcrumb [condensed]="true" [items]="breadcrumbItems" />
 * ```
 */
@Component({
  selector: 'mzn-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznBreadcrumbItem],
  host: {
    '[class]': 'hostClass',
    'aria-label': 'Breadcrumb',
    role: 'navigation',
  },
  template: `
    @for (
      item of visibleItems();
      track item.id ?? item.name;
      let last = $last;
      let idx = $index
    ) {
      @if (idx > 0) {
        <i mznIcon [icon]="slashIcon" [size]="14"></i>
      }
      <mzn-breadcrumb-item
        [current]="last"
        [href]="item.href"
        [name]="item.name"
        [target]="item.target"
        (itemClick)="item.onClick?.()"
      />
    }
  `,
})
export class MznBreadcrumb {
  protected readonly hostClass = classes.host;
  protected readonly slashIcon = SlashIcon;

  /**
   * 是否啟用精簡模式。
   * 精簡模式下僅顯示最後兩個項目（當前頁面及其父層），
   * 隱藏中間項目。overflow 下拉選單後續版本實作。
   * @default false
   */
  readonly condensed = input(false);

  /** 麵包屑項目資料陣列。 */
  readonly items = input.required<readonly BreadcrumbItemData[]>();

  /** 依據 condensed 模式決定顯示的項目。 */
  protected readonly visibleItems = computed(
    (): readonly BreadcrumbItemData[] => {
      const all = this.items();

      if (this.condensed() && all.length > 2) {
        return all.slice(-2);
      }

      return all;
    },
  );
}
