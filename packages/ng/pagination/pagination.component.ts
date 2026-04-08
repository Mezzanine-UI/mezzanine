import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { paginationClasses as classes } from '@mezzanine-ui/core/pagination';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznPaginationItem } from './pagination-item.component';
import { MznPaginationJumper } from './pagination-jumper.component';
import { MznPaginationPageSize } from './pagination-page-size.component';

/** 分頁項目描述。 */
export interface PaginationItem {
  readonly active: boolean;
  readonly disabled: boolean;
  readonly page: number;
  readonly type: string;
}

function range(start: number, end: number): ReadonlyArray<number> {
  const length = end - start + 1;

  return Array.from({ length }, (_, i) => start + i);
}

/**
 * 分頁導覽元件，提供頁碼切換。
 *
 * 根據 `total`、`pageSize`、`current`、`boundaryCount` 與 `siblingCount`
 * 自動計算頁碼清單，包含省略號、上/下一頁按鈕。
 *
 * @example
 * ```html
 * import { MznPagination } from '@mezzanine-ui/ng/pagination';
 *
 * <nav mznPagination
 *   [total]="200"
 *   [current]="currentPage"
 *   [pageSize]="10"
 *   (pageChanged)="currentPage = $event"
 * ></nav>
 * ```
 */
@Component({
  selector: '[mznPagination]',
  standalone: true,
  imports: [
    MznTypography,
    MznPaginationItem,
    MznPaginationJumper,
    MznPaginationPageSize,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'navigation',
    'aria-label': 'pagination navigation',
    '[class]': 'hostClass',
    '[attr.boundaryCount]': 'null',
    '[attr.current]': 'null',
    '[attr.disabled]': 'null',
    '[attr.pageSize]': 'null',
    '[attr.siblingCount]': 'null',
    '[attr.total]': 'null',
    '[attr.showJumper]': 'null',
    '[attr.buttonText]': 'null',
    '[attr.hintText]': 'null',
    '[attr.inputPlaceholder]': 'null',
    '[attr.showPageSizeOptions]': 'null',
    '[attr.pageSizeLabel]': 'null',
    '[attr.pageSizeOptions]': 'null',
    '[attr.renderPageSizeOptionName]': 'null',
    '[attr.renderResultSummary]': 'null',
  },
  template: `
    @if (renderResultSummary()) {
      <span
        mznTypography
        variant="label-primary"
        [class]="resultSummaryClass"
        >{{ resultSummaryText() }}</span
      >
    }
    @if (showPageSizeOptions()) {
      <li [class]="pageSizeContainerClass">
        <div
          mznPaginationPageSize
          [disabled]="disabled()"
          [label]="pageSizeLabel()"
          [options]="pageSizeOptions()"
          [renderOptionName]="renderPageSizeOptionName()"
          [value]="pageSize()"
          (pageSizeChanged)="pageSizeChanged.emit($event)"
        ></div>
      </li>
    }
    <ul [class]="containerClass">
      <li>
        <ul [class]="itemListClass">
          @for (item of items(); track $index) {
            <li [class]="itemClass">
              @if (itemTemplate(); as tpl) {
                <ng-container
                  [ngTemplateOutlet]="tpl"
                  [ngTemplateOutletContext]="{ $implicit: item }"
                />
              } @else {
                <div
                  mznPaginationItem
                  [active]="item.active"
                  [disabled]="item.disabled"
                  [page]="item.page"
                  [type]="item.type"
                  (itemClick)="onItemClick(item)"
                ></div>
              }
            </li>
          }
        </ul>
      </li>
      @if (showJumper()) {
        <li [class]="jumperContainerClass">
          <div
            mznPaginationJumper
            [buttonText]="buttonText()"
            [disabled]="disabled()"
            [hintText]="hintText()"
            [inputPlaceholder]="inputPlaceholder()"
            [pageSize]="pageSize()"
            [total]="total()"
            (pageChanged)="pageChanged.emit($event)"
          ></div>
        </li>
      }
    </ul>
  `,
})
export class MznPagination {
  /** 首尾始終顯示的頁數。 */
  readonly boundaryCount = input(1);

  /** 目前頁碼。 */
  readonly current = input(1);

  /** 是否禁用。 */
  readonly disabled = input(false);

  /** 每頁筆數。 */
  readonly pageSize = input(10);

  /** 當前頁兩側顯示的頁數。 */
  readonly siblingCount = input(1);

  /** 總筆數。 */
  readonly total = input(0);

  /** 是否顯示頁碼跳轉輸入框。 @default false */
  readonly showJumper = input(false);

  /** 跳轉按鈕文字。 */
  readonly buttonText = input<string | undefined>(undefined);

  /** 跳轉輸入框前的提示文字。 */
  readonly hintText = input<string | undefined>(undefined);

  /** 跳轉輸入框的 placeholder。 */
  readonly inputPlaceholder = input<string | undefined>(undefined);

  /** 是否顯示每頁筆數選擇器。 @default false */
  readonly showPageSizeOptions = input(false);

  /** 每頁筆數選擇器的標籤文字。 */
  readonly pageSizeLabel = input<string | undefined>(undefined);

  /** 每頁筆數選項清單。 */
  readonly pageSizeOptions = input<ReadonlyArray<number> | undefined>(
    undefined,
  );

  /**
   * 自訂每頁筆數選項名稱的渲染函式。
   * 等效 React 版 `renderPageSizeOptionName` prop。
   * @example (pageSize) => `${pageSize} 筆`
   */
  readonly renderPageSizeOptionName = input<
    ((pageSize: number) => string) | undefined
  >(undefined);

  /**
   * 自訂結果摘要渲染函式。
   * 接收 from、to、total 三個參數，回傳顯示字串。
   * @example (from, to, total) => `顯示 ${from}–${to} 筆，共 ${total} 筆`
   */
  readonly renderResultSummary = input<
    ((from: number, to: number, total: number) => string) | undefined
  >(undefined);

  /** 自訂分頁項目渲染樣板，等同 React `itemRender` prop。 */
  readonly itemTemplate =
    contentChild<TemplateRef<{ $implicit: PaginationItem }>>('itemTemplate');

  /** 頁碼切換事件。 */
  readonly pageChanged = output<number>();

  /** 每頁筆數變更事件。 */
  readonly pageSizeChanged = output<number>();

  protected readonly hostClass = classes.host;
  protected readonly containerClass = classes.container;
  protected readonly itemListClass = classes.itemList;
  protected readonly itemClass = classes.item;
  protected readonly resultSummaryClass = classes.resultSummary;
  protected readonly pageSizeContainerClass = classes.pageSize;
  protected readonly jumperContainerClass = classes.jumper;

  protected readonly resultSummaryText = computed((): string => {
    const fn = this.renderResultSummary();

    if (!fn) return '';

    const cur = this.current();
    const ps = this.pageSize();
    const total = this.total();
    const from = ps * (cur - 1) + 1;
    const to = Math.min(ps * cur, total);

    return fn(from, to, total);
  });

  private readonly totalPages = computed((): number => {
    const t = this.total();

    return t ? Math.ceil(t / this.pageSize()) : 1;
  });

  readonly items = computed((): ReadonlyArray<PaginationItem> => {
    const cur = this.current();
    const tp = this.totalPages();
    const bc = this.boundaryCount();
    const sc = this.siblingCount();
    const dis = this.disabled();

    const startPages = range(1, Math.min(bc, tp));
    const endPages = range(Math.max(tp - bc + 1, bc + 1), tp);

    const siblingsStart = Math.max(
      Math.min(cur - sc, tp - bc - sc * 2 - 1),
      bc + 2,
    );

    const siblingsEnd = Math.min(
      Math.max(cur + sc, bc + sc * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : tp - 1,
    );

    const rawItems: ReadonlyArray<number | string> = [
      'previous',
      ...startPages,
      ...(siblingsStart > bc + 2
        ? ['ellipsis']
        : bc + 1 < tp - bc
          ? [bc + 1]
          : []),
      ...range(siblingsStart, siblingsEnd),
      ...(siblingsEnd < tp - bc - 1
        ? ['ellipsis']
        : tp - bc > bc
          ? [tp - bc]
          : []),
      ...endPages,
      'next',
    ];

    return rawItems.map((raw): PaginationItem => {
      if (typeof raw === 'number') {
        return {
          active: raw === cur,
          disabled: dis,
          page: raw,
          type: 'page',
        };
      }

      if (raw === 'previous') {
        return {
          active: false,
          disabled: dis || cur === 1,
          page: cur - 1,
          type: 'previous',
        };
      }

      if (raw === 'next') {
        return {
          active: false,
          disabled: dis || cur === tp,
          page: cur + 1,
          type: 'next',
        };
      }

      return {
        active: false,
        disabled: dis,
        page: 0,
        type: 'ellipsis',
      };
    });
  });

  protected onItemClick(item: PaginationItem): void {
    if (!item.disabled && item.page > 0) {
      this.pageChanged.emit(item.page);
    }
  }
}
