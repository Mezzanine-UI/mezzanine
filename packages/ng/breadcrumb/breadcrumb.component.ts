import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { breadcrumbClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { DotHorizontalIcon, SlashIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznBreadcrumbItem } from './breadcrumb-item.component';

/** 麵包屑資料項目介面。 */
export interface BreadcrumbItemData {
  /** 是否為目前頁面。 */
  readonly current?: boolean;
  /** 連結目標。 */
  readonly href?: string;
  /** 項目唯一識別碼,對應 React `id` prop。若未提供則 fallback 使用 `name`。 */
  readonly id?: string;
  /** 項目名稱。 */
  readonly name: string;
  /** 點擊回呼。 */
  readonly onClick?: () => void;
  /** 連結 target 屬性。 */
  readonly target?: string;
}

interface BreadcrumbItemSlot {
  readonly kind: 'item';
  readonly data: BreadcrumbItemData;
  readonly id: string;
  readonly current: boolean;
}

interface BreadcrumbOverflowSlot {
  readonly kind: 'overflow';
  readonly id: string;
  readonly collapsed: readonly (BreadcrumbItemData & { id: string })[];
}

type BreadcrumbSlot = BreadcrumbItemSlot | BreadcrumbOverflowSlot;

/**
 * 麵包屑導覽元件,顯示頁面在階層中的位置。
 *
 * 透過 `items` 輸入以資料驅動方式渲染,自動處理分隔線、當前頁標記,
 * 以及超過 4 項或 `condensed` 模式時的中段項目收合(以 overflow 按鈕呈現)。
 *
 * 最後一個項目會被自動標記為 `current`,不論其 `current` 欄位原值為何。
 *
 * @example
 * ```html
 * import { MznBreadcrumb } from '@mezzanine-ui/ng/breadcrumb';
 *
 * <nav mznBreadcrumb [items]="[
 *   { id: 'home', name: '首頁', href: '/' },
 *   { id: 'products', name: '產品', href: '/products' },
 *   { id: 'current', name: '目前頁面' }
 * ]" ></nav>
 *
 * <nav mznBreadcrumb [condensed]="true" [items]="breadcrumbItems" ></nav>
 * ```
 */
@Component({
  selector: '[mznBreadcrumb]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznBreadcrumbItem],
  host: {
    '[class]': 'hostClass',
    'aria-label': 'Breadcrumb',
    '[attr.condensed]': 'null',
    '[attr.items]': 'null',
  },
  template: `
    @for (slot of slots(); track slot.id; let idx = $index) {
      @if (idx > 0) {
        <i mznIcon [icon]="slashIcon" [size]="14"></i>
      }
      @if (slot.kind === 'item') {
        <span
          mznBreadcrumbItem
          [current]="slot.current"
          [href]="slot.data.href"
          [itemId]="slot.id"
          [name]="slot.data.name"
          [target]="slot.data.target"
          (itemClick)="slot.data.onClick?.()"
        ></span>
      } @else {
        <button
          type="button"
          aria-label="more options"
          [class]="iconButtonClass"
        >
          <i mznIcon [icon]="dotIcon" [size]="14"></i>
        </button>
      }
    }
  `,
})
export class MznBreadcrumb {
  protected readonly hostClass = classes.host;
  protected readonly iconButtonClass = classes.iconButton;
  protected readonly slashIcon = SlashIcon;
  protected readonly dotIcon = DotHorizontalIcon;

  /**
   * 是否啟用精簡模式。
   * 精簡模式下僅顯示最後兩個項目(當前頁面及其父層);若項目超過 2 項,
   * 會在前方加上 overflow 按鈕,代表被收合的中段項目。
   * @default false
   */
  readonly condensed = input(false);

  /** 麵包屑項目資料陣列。 */
  readonly items = input.required<readonly BreadcrumbItemData[]>();

  /** 依 React `renderItems` 演算法展開成 slot 陣列。 */
  protected readonly slots = computed((): readonly BreadcrumbSlot[] => {
    const items = this.items();
    const condensed = this.condensed();
    const lastIndex = items.length - 1;

    if (lastIndex < 0) {
      return [];
    }

    const withId = (
      item: BreadcrumbItemData,
    ): BreadcrumbItemData & {
      id: string;
    } => ({
      ...item,
      id: item.id ?? item.name,
    });

    const toItemSlot = (
      item: BreadcrumbItemData,
      current: boolean,
    ): BreadcrumbItemSlot => {
      const withIdItem = withId(item);

      return {
        kind: 'item',
        data: withIdItem,
        id: withIdItem.id,
        current,
      };
    };

    const slots: BreadcrumbSlot[] = [];
    const hasOverflowDropdownIcon = !condensed || items.length > 2;
    const collapsed = hasOverflowDropdownIcon
      ? condensed
        ? items.map(withId).slice(0, lastIndex - 1)
        : items.map(withId).slice(2, lastIndex - 1)
      : [];

    // home
    if (!condensed && lastIndex >= 0) {
      slots.push(toItemSlot(items[0], lastIndex === 0));
    }

    // second
    if (!condensed && lastIndex >= 1) {
      slots.push(toItemSlot(items[1], lastIndex === 1));
    }

    // default mode with length <= 4
    if (!condensed && items.length <= 4) {
      if (lastIndex >= 2) {
        slots.push(toItemSlot(items[2], lastIndex === 2));
      }

      if (lastIndex === 3) {
        slots.push(toItemSlot(items[3], true));
      }
    }

    // default mode with length > 4 or condensed with length > 2
    if (items.length > 4 || condensed) {
      if (hasOverflowDropdownIcon) {
        slots.push({
          kind: 'overflow',
          id: '__overflow__',
          collapsed,
        });
      }

      // parent of current
      if (lastIndex - 1 >= 0) {
        slots.push(toItemSlot(items[lastIndex - 1], false));
      }

      // current
      slots.push(toItemSlot(items[lastIndex], true));
    }

    return slots;
  });
}
