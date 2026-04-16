import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  CdkDragHandle,
  CdkDragStart,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  CaretDownIcon,
  CaretUpIcon,
  ChevronRightIcon,
  DotDragVerticalIcon,
  PinFilledIcon,
  PinIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznCheckbox } from '@mezzanine-ui/ng/checkbox';
import { MznEmpty } from '@mezzanine-ui/ng/empty';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPagination } from '@mezzanine-ui/ng/pagination';
import { MznRadio } from '@mezzanine-ui/ng/radio';
import { MznScrollbar } from '@mezzanine-ui/ng/scrollbar';
import { MznToggle } from '@mezzanine-ui/ng/toggle';
import clsx from 'clsx';
import { MznTableCellRender } from './table-cell-render.directive';
import { MZN_TABLE_CONTEXT, type TableContextValue } from './table-context';
import {
  type ColumnAlign,
  type HighlightMode,
  type RowHeightPreset,
  type SortOrder,
  type TableActionItem,
  type TableActions,
  type TableActionVariant,
  type TableCollectable,
  type TableColumn,
  type TableDataSource,
  type TableDraggable,
  type TableEmptyProps,
  type TableExpandable,
  type TablePagination,
  type TablePinnable,
  type TableRowSelection,
  type TableRowSelectionCheckbox,
  type TableRowState,
  type TableScroll,
  type TableSelectionMode,
  type TableSize,
  type TableToggleable,
  type TableTransitionState,
  getRowKey,
} from './table-types';
import { tableClasses } from '@mezzanine-ui/core/table';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CELL_ALIGN_MAP: Record<ColumnAlign, string> = {
  start: tableClasses.cellAlignStart,
  center: tableClasses.cellAlignCenter,
  end: tableClasses.cellAlignEnd,
};

function nextSortOrder(current: SortOrder): SortOrder {
  if (current === 'ascend') return 'descend';
  if (current === 'descend') return null;

  return 'ascend';
}

/**
 * 資料驅動的表格元件，以 `columns` 與 `dataSource` 定義結構與資料。
 *
 * 支援排序、勾選列、展開列與斑馬紋等常見需求。
 * 採用 configuration-based 設計，與 React 版 Table 行為一致。
 *
 * @example
 * ```html
 * import { MznTable } from '@mezzanine-ui/ng/table';
 *
 * <div mznTable [columns]="columns" [dataSource]="data" ></div>
 * ```
 *
 * @see TableColumn
 * @see TableDataSource
 */
@Component({
  selector: '[mznTable]',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FormsModule,
    MznButton,
    MznCheckbox,
    MznEmpty,
    MznIcon,
    MznPagination,
    MznRadio,
    MznScrollbar,
    MznToggle,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MZN_TABLE_CONTEXT,
      useFactory: (table: MznTable): TableContextValue => ({
        columns: (): readonly TableColumn[] => table.columns(),
        expandedRowKeys: (): ReadonlySet<string> =>
          table.internalExpandedKeys(),
        highlightMode: (): HighlightMode => table.highlight(),
        selectedRowKeys: (): ReadonlySet<string> =>
          table.internalSelectedKeys(),
        selectionMode: (): TableSelectionMode => table.selectionMode(),
        size: (): TableSize => table.size(),
        toggleExpansion: (key: string): void => {
          table.onToggleExpansion({ key } as TableDataSource);
        },
        toggleSelectAll: (keys: readonly string[]): void => {
          table.onSelectAll(keys);
        },
        toggleSelection: (key: string): void => {
          table.onToggleSelection({ key } as TableDataSource);
        },
      }),
      deps: [MznTable],
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
    '[attr.actions]': 'null',
    '[attr.collectable]': 'null',
    '[attr.columns]': 'null',
    '[attr.dataSource]': 'null',
    '[attr.draggable]': 'null',
    '[attr.emptyProps]': 'null',
    '[attr.emptyText]': 'null',
    '[attr.expandable]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.highlight]': 'null',
    '[attr.loading]': 'null',
    '[attr.loadingRowsCount]': 'null',
    '[attr.minHeight]': 'null',
    '[attr.nested]': 'null',
    '[attr.pagination]': 'null',
    '[attr.pinnable]': 'null',
    '[attr.resizable]': 'null',
    '[attr.scroll]': 'null',
    '[attr.toggleable]': 'null',
    '[attr.transitionState]': 'null',
    '[attr.rowHeightPreset]': 'null',
    '[attr.rowSelection]': 'null',
    '[attr.rowState]': 'null',
    '[attr.selectedRowKeys]': 'null',
    '[attr.separatorAtRowIndexes]': 'null',
    '[attr.showHeader]': 'null',
    '[attr.size]': 'null',
    '[attr.sticky]': 'null',
    '[attr.zebraStriping]': 'null',
  },
  template: `
    <!-- Scrollbar wrapper mirrors React <Scrollbar class="mzn-table--sticky"> -->
    <div
      mznScrollbar
      [class.mzn-table--sticky]="sticky()"
      [disabled]="nested()"
      [maxHeight]="scrollMaxHeight() ?? undefined"
    >
      <table [class]="rootClasses()">
        <colgroup>
          @if (isDragEnabled() || isPinEnabled()) {
            <col style="width: 40px; min-width: 40px; max-width: 40px;" />
          }
          @if (isExpandableEnabled()) {
            <col style="width: 40px; min-width: 40px; max-width: 40px;" />
          }
          @if (hasSelection()) {
            <col style="width: 40px; min-width: 40px; max-width: 40px;" />
          }
          @for (col of columns(); track col.key; let colIndex = $index) {
            <col
              [style.width]="getColWidth(col, colIndex)"
              [style.min-width]="formatWidth(col.minWidth)"
              [style.max-width]="formatWidth(col.maxWidth)"
            />
          }
          @if (collectable()?.enabled) {
            <col style="width: 80px;" />
          }
          @if (toggleable()?.enabled) {
            <col style="width: 80px;" />
          }
          @if (actions(); as act) {
            <col [style.width]="formatWidth(act.width)" />
          }
        </colgroup>
        @if (showHeader()) {
          <thead [class]="headerClass">
            <tr>
              @if (isDragEnabled() || isPinEnabled()) {
                <th [class]="dragOrPinHandleCellClass"></th>
              }
              @if (hasSelection()) {
                <th [class]="headerSelectionCellClass" scope="col">
                  <div [class]="selectionCheckboxClass">
                    @if (selectionMode() === 'checkbox' && !hideSelectAll()) {
                      <div
                        mznCheckbox
                        [ngModel]="allSelected()"
                        [indeterminate]="someSelected()"
                        (ngModelChange)="onSelectAll()"
                      ></div>
                    }
                  </div>
                </th>
              }
              @if (isExpandableEnabled()) {
                <th [class]="headerExpandCellClass" scope="col"></th>
              }
              @for (col of columns(); track col.key; let colIndex = $index) {
                <th [class]="getHeaderCellClasses(col)" scope="col">
                  <div [class]="headerCellContentClass">
                    <div [class]="getHeaderCellActionsClasses(col)">
                      <span [class]="headerCellTitleClass">{{
                        col.title
                      }}</span>
                      @if (col.onSort) {
                        <button
                          type="button"
                          [class]="sortIconsClass"
                          (click)="onSortIconClick($event, col)"
                          (keydown)="onSortIconKeyDown($event, col)"
                        >
                          <i
                            mznIcon
                            [icon]="caretUpIcon"
                            [size]="8"
                            [class]="getSortIconClass(col, 'ascend')"
                          ></i>
                          <i
                            mznIcon
                            [icon]="caretDownIcon"
                            [size]="8"
                            [class]="getSortIconClass(col, 'descend')"
                          ></i>
                        </button>
                      }
                    </div>
                  </div>
                  @if (resizable()) {
                    <span
                      [class]="resizeHandleClass"
                      (pointerdown)="onResizeStart($event, colIndex)"
                    ></span>
                  }
                </th>
              }
              @if (collectable()?.enabled) {
                <th scope="col">
                  <div [class]="headerCellContentClass">
                    <div [class]="headerCellActionsBaseClass">
                      <span [class]="headerCellTitleClass">{{
                        collectable()!.title ?? '收藏'
                      }}</span>
                    </div>
                  </div>
                </th>
              }
              @if (toggleable()?.enabled) {
                <th scope="col">
                  <div [class]="headerCellContentClass">
                    <div [class]="headerCellActionsBaseClass">
                      <span [class]="headerCellTitleClass">{{
                        toggleable()!.title ?? ''
                      }}</span>
                    </div>
                  </div>
                </th>
              }
              @if (actions(); as act) {
                <th [class]="headerCellClass" scope="col">
                  <div [class]="headerCellContentClass">
                    <div [class]="getActionsHeaderActionsClasses(act)">
                      <span [class]="headerCellTitleClass">{{
                        act.title ?? ''
                      }}</span>
                    </div>
                  </div>
                </th>
              }
            </tr>
          </thead>
        }
        <tbody
          [class]="bodyClass"
          cdkDropList
          [cdkDropListDisabled]="!isDragEnabled()"
          (cdkDropListDropped)="onDrop($event)"
        >
          @if (dataSource().length === 0) {
            <tr [class]="emptyRowClass">
              <td [attr.colspan]="totalColumns()" [class]="emptyClass">
                @if (emptyProps(); as ep) {
                  <div
                    mznEmpty
                    [title]="ep.title"
                    [type]="ep.type ?? 'initial-data'"
                    [size]="ep.size ?? 'main'"
                    [description]="ep.description"
                    [style.height]="formatEmptyHeight(ep.height)"
                  ></div>
                } @else {
                  {{ emptyText() }}
                }
              </td>
            </tr>
          }
          @for (
            record of dataSource();
            track trackByRowKey($index, record);
            let idx = $index
          ) {
            <tr
              [class]="getRowClasses(record, idx)"
              [style.height]="resolvedRowHeight()"
              (click)="onRowClick(record)"
              (mouseleave)="onRowMouseLeave()"
              cdkDrag
              [cdkDragDisabled]="!isDragEnabled() || isDragDisabled(record)"
              (cdkDragStarted)="onDragStarted($event)"
              (cdkDragEnded)="onDragEnded($event)"
            >
              @if (isDragEnabled()) {
                <td [class]="dragOrPinHandleCellClass" cdkDragHandle>
                  <span [class]="dragOrPinHandleClass">
                    <i mznIcon [icon]="dotDragVerticalIcon" color="neutral"></i>
                  </span>
                </td>
              } @else if (isPinEnabled()) {
                <td
                  [class]="dragOrPinHandleCellClass"
                  (click)="onPinClick(record); $event.stopPropagation()"
                >
                  <span [class]="dragOrPinHandleClass">
                    <i
                      mznIcon
                      [icon]="isPinned(record) ? pinFilledIcon : pinIcon"
                      [class]="pinHandleIconClass"
                      color="neutral"
                    ></i>
                  </span>
                </td>
              }
              @if (hasSelection()) {
                <td [class]="bodySelectionCellClass">
                  <div [class]="selectionCheckboxClass">
                    @if (selectionMode() === 'radio') {
                      <div
                        mznRadio
                        name="mzn-table-radio"
                        [value]="getRowKeyOf(record)"
                        [ngModel]="selectedRadioValue()"
                        [disabled]="isSelectionDisabled(record)"
                        (ngModelChange)="onRadioNgModelChange($event)"
                      ></div>
                    } @else {
                      <div
                        mznCheckbox
                        [ngModel]="isSelected(record)"
                        [disabled]="isSelectionDisabled(record)"
                        (ngModelChange)="onToggleSelection(record)"
                      ></div>
                    }
                  </div>
                </td>
              }
              @if (isExpandableEnabled()) {
                <td [class]="bodyExpandCellClass">
                  @if (canExpandRow(record)) {
                    <button
                      type="button"
                      [class]="getExpandIconClasses(record)"
                      (click)="onExpandIconClick($event, record)"
                    >
                      <i mznIcon [icon]="chevronRightIcon" color="inherit"></i>
                    </button>
                  }
                </td>
              }
              @for (col of columns(); track col.key; let colIndex = $index) {
                <td
                  [class]="getCellClasses(col)"
                  [class.mzn-table__cell--highlight]="
                    isCellHighlighted(idx, colIndex)
                  "
                  (mouseenter)="onCellMouseEnter(idx, colIndex)"
                >
                  <div style="display: grid; width: 100%;">
                    <div [class]="getCellContentClasses(col)">
                      @if (cellRenderMap().get(col.key); as cellTpl) {
                        <ng-container
                          *ngTemplateOutlet="
                            cellTpl;
                            context: { $implicit: record, index: idx }
                          "
                        />
                      } @else {
                        {{ getCellValue(record, col) }}
                      }
                    </div>
                  </div>
                </td>
              }
              @if (collectable()?.enabled) {
                <td>
                  <button
                    type="button"
                    [class]="collectHandleIconClass"
                    [disabled]="isCollectDisabled(record)"
                    (click)="onCollectClick(record); $event.stopPropagation()"
                  >
                    <i
                      mznIcon
                      [icon]="
                        isCollected(record) ? starFilledIcon : starOutlineIcon
                      "
                      color="neutral"
                    ></i>
                  </button>
                </td>
              }
              @if (toggleable()?.enabled) {
                <td>
                  <div
                    mznToggle
                    [checked]="isToggled(record)"
                    [disabled]="isToggleDisabled(record)"
                    size="sub"
                    (click)="onToggleClick(record, $event)"
                  ></div>
                </td>
              }
              @if (actions(); as act) {
                <td [class]="cellClass">
                  <div [class]="getActionsCellContentClasses(act)">
                    <div [class]="actionsCellClass">
                      @for (
                        action of act.render(record, idx);
                        track action.key
                      ) {
                        <button
                          mznButton
                          type="button"
                          size="sub"
                          [variant]="resolveActionVariant(action, act)"
                          [disabled]="action.disabled ?? false"
                          (click)="
                            action.onClick?.(record, idx);
                            $event.stopPropagation()
                          "
                        >
                          {{ action.label }}
                        </button>
                      }
                    </div>
                  </div>
                </td>
              }
            </tr>
            @if (isExpandableEnabled() && isExpanded(record)) {
              <tr [class]="getExpandedRowClasses(record)">
                <td
                  [attr.colspan]="totalColumns()"
                  [class]="expandedRowCellClass"
                >
                  <div [class]="expandedContentClass">
                    @if (expandedTemplate(); as tpl) {
                      <ng-container
                        *ngTemplateOutlet="tpl; context: { $implicit: record }"
                      />
                    }
                  </div>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
    @if (pagination()) {
      <div [class]="paginationWrapperClass">
        <nav
          mznPagination
          [current]="pagination()!.current ?? 1"
          [pageSize]="pagination()!.pageSize ?? 10"
          [total]="pagination()!.total"
          [disabled]="pagination()!.disabled ?? false"
          (pageChanged)="onPaginationChange($event)"
        ></nav>
      </div>
    }
  `,
})
export class MznTable {
  /* ---------------------------------------------------------------- */
  /*  Inputs (alphabetical)                                            */
  /* ---------------------------------------------------------------- */

  /**
   * 動作欄設定。啟用後在表格右側顯示動作按鈕欄。
   * @default undefined
   */
  readonly actions = input<TableActions>();

  /**
   * 收藏欄設定。啟用後在每列顯示收藏按鈕，並追蹤已收藏狀態。
   * @default undefined
   */
  readonly collectable = input<TableCollectable>();

  /** 欄位定義。 */
  readonly columns = input.required<readonly TableColumn[]>();

  /** 資料來源。 */
  readonly dataSource = input<readonly TableDataSource[]>([]);

  /** 拖曳排序設定。 */
  readonly draggable = input<TableDraggable>();

  /**
   * 空狀態元件設定。提供後會在無資料時渲染 MznEmpty 元件。
   * 優先於 emptyText。
   * @default undefined
   */
  readonly emptyProps = input<TableEmptyProps>();

  /**
   * 無資料時顯示的文字。當 emptyProps 未設定時使用。
   * @default 'No data'
   */
  readonly emptyText = input('No data');

  /**
   * 展開列設定。
   *
   * 相容兩種型別：
   * - `boolean` — 啟用展開列但不渲染自訂內容（僅保留 toggle）。
   *   等同於 React 未提供 `expandedRowRender` 的情況。
   * - `TableExpandable<T>` — 完整設定：提供 `template` 以客製展開
   *   內容、`expandedRowKeys` 受控、`onExpand` / `onExpandedRowsChange`
   *   事件、以及 `rowExpandable` 決定哪些列可展開。
   *
   * @default false
   */
  readonly expandable = input<TableExpandable | boolean>(false);

  /**
   * 解析後的展開設定物件；`true` 會轉成空物件，`false`/`undefined`
   * 則回傳 `null`。內部邏輯統一從這邊讀取設定。
   */
  protected readonly expandableConfig = computed((): TableExpandable | null => {
    const value = this.expandable();
    if (value === false || value == null) return null;
    if (value === true) return {};
    return value;
  });

  /** 展開列功能是否啟用（展開圖示欄位是否顯示）。 */
  protected readonly isExpandableEnabled = computed(
    (): boolean => this.expandableConfig() !== null,
  );

  /** 展開列內容模板（若未提供則回傳 null，不渲染自訂內容）。 */
  protected readonly expandedTemplate = computed(
    (): TemplateRef<{ $implicit: TableDataSource }> | null =>
      this.expandableConfig()?.template ?? null,
  );

  constructor() {
    // Sync controlled expandedRowKeys → internal signal whenever input changes.
    effect(() => {
      const controlled = this.expandableConfig()?.expandedRowKeys;
      if (!controlled) return;
      const next = new Set(controlled);
      const current = this.internalExpandedKeys();
      if (
        next.size !== current.size ||
        [...next].some((k) => !current.has(k))
      ) {
        this.internalExpandedKeys.set(next);
      }
    });

    // Measure the MznTable host element's width — a block element whose width
    // is dictated by the surrounding layout. Observing the scrollbar wrapper
    // would collapse to the table's own width (chicken-and-egg). Mirrors
    // React `useTableScroll` + `calculateColumnWidths`.
    afterNextRender(() => {
      const el = this.hostEl.nativeElement;

      const apply = (): void => this.containerWidth.set(el.clientWidth);

      apply();
      const ro = new ResizeObserver(apply);

      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  /**
   * 是否讓表格填滿容器寬度。
   * @default false
   */
  readonly fullWidth = input(false);

  /**
   * 滑鼠 hover 時的高亮模式。
   * @default 'row'
   */
  readonly highlight = input<HighlightMode>('row');

  /**
   * 是否顯示載入狀態。
   * @default false
   */
  readonly loading = input(false);

  /**
   * 載入時顯示的骨架列數。
   * @default 10
   */
  readonly loadingRowsCount = input(10);

  /**
   * 表格最小高度，接受數字（px）或 CSS 字串。
   */
  readonly minHeight = input<number | string>();

  /**
   * 此表格是否巢狀於展開列內容區域。
   * @default false
   */
  readonly nested = input(false);

  /**
   * 分頁設定。提供後會在表格下方顯示分頁列。
   * @default undefined
   */
  readonly pagination = input<TablePagination>();

  /**
   * 釘選列設定。啟用後可將特定列釘選至頂端。
   * 注意：與 draggable 不可同時使用。
   * @default undefined
   */
  readonly pinnable = input<TablePinnable>();

  /**
   * 是否允許使用者拖曳調整欄位寬度。
   * @default false
   */
  readonly resizable = input(false);

  /**
   * 捲動設定。設定 y 高度上限以啟用垂直捲動。
   *
   * **TODO (virtualized scroll)**：React 的 `scroll.virtualized` 模式
   * 尚未在 Angular 版實作。未來會透過 `@angular/cdk/scrolling` 的
   * `CdkVirtualScrollViewport` 補上，以保持 API 對齊。目前傳入
   * `scroll.virtualized: true` 會被忽略，table 會 fallback 到一般
   * DOM 渲染；Storybook 中的 `Virtualized (In Development)` 故事會明
   * 顯標示此狀態。追蹤項目：Phase 6。
   *
   * @default undefined
   */
  readonly scroll = input<TableScroll>();

  /**
   * 欄位顯示切換設定。啟用後在每列顯示開關，追蹤顯示狀態。
   * @default undefined
   */
  readonly toggleable = input<TableToggleable>();

  /**
   * 資料列進入／離開動畫的過渡狀態，由 useTableDataSource hook 提供。
   * @default undefined
   */
  readonly transitionState = input<TableTransitionState>();

  /**
   * 列高預設值。
   * @default 'base'
   */
  readonly rowHeightPreset = input<RowHeightPreset>('base');

  /**
   * 列選取設定。傳入 `true` 啟用簡易 checkbox 模式，
   * 或傳入 TableRowSelection 物件以使用完整設定（含 mode、onChange、selectedRowKeys 等）。
   * @default false
   */
  readonly rowSelection = input<TableRowSelection | boolean>(false);

  /**
   * 各列的語意狀態，接受固定字串或依列資料回傳狀態的函式。
   */
  readonly rowState = input<
    TableRowState | ((rowData: TableDataSource) => TableRowState | undefined)
  >();

  /**
   * 受控的已選取列 key 陣列。
   * @default []
   */
  readonly selectedRowKeys = input<readonly string[]>([]);

  /**
   * 在指定列索引處顯示分隔線。
   */
  readonly separatorAtRowIndexes = input<readonly number[]>();

  /**
   * 是否顯示表頭列。
   * @default true
   */
  readonly showHeader = input(true);

  /**
   * 表格尺寸。
   * @default 'main'
   */
  readonly size = input<TableSize>('main');

  /**
   * 是否啟用 sticky header。
   * @default true (對齊 React 版預設值)
   */
  readonly sticky = input(true);

  /**
   * 是否啟用斑馬紋。
   * @default false
   */
  readonly zebraStriping = input(false);

  /* ---------------------------------------------------------------- */
  /*  Outputs                                                          */
  /* ---------------------------------------------------------------- */

  /** 展開列 key 變更事件。 */
  readonly expandedRowKeysChange = output<readonly string[]>();

  /** 已選取列 key 變更事件。 */
  readonly selectedRowKeysChange = output<readonly string[]>();

  /** 排序變更事件。 */
  readonly sortChange = output<{
    readonly key: string;
    readonly order: SortOrder;
  }>();

  /* ---------------------------------------------------------------- */
  /*  Internal state                                                   */
  /* ---------------------------------------------------------------- */

  readonly internalSelectedKeys = signal<ReadonlySet<string>>(new Set());
  readonly internalExpandedKeys = signal<ReadonlySet<string>>(new Set());

  /**
   * Hover highlight state, mirroring React `highlight` context (hoveredRowIndex
   * / hoveredColumnIndex / setHoveredCell). Cell `mouseenter` sets both
   * indices; row `mouseleave` clears them.
   */
  private readonly hoveredRowIndex = signal<number | null>(null);
  private readonly hoveredColumnIndex = signal<number | null>(null);

  /** Resizable: index of column currently being resized (-1 = none). */
  private readonly resizingColIndex = signal<number | null>(null);
  /** Resizable: pointer X at drag start. */
  private readonly resizeStartX = signal(0);
  /** Resizable: map of col key → width in px captured at drag start. */
  private readonly resizeStartWidths = signal<ReadonlyMap<string, number>>(
    new Map(),
  );
  /** Resizable: live overridden widths (col key → px). */
  readonly resizedWidths = signal<ReadonlyMap<string, number>>(new Map());

  /**
   * 測得的 scroll container 寬度，供 column width 分配使用。
   * 對齊 React `useTableScroll` 的 containerWidth。
   */
  private readonly containerWidth = signal(0);

  private readonly destroyRef = inject(DestroyRef);

  /**
   * 收集所有 `<ng-template mznTableCellRender="...">`，依 column key 索引。
   * 提供 cell 使用者自訂 render 的能力，對齊 React `column.render`。
   */
  private readonly cellRenderDirectives = contentChildren(MznTableCellRender);

  protected readonly cellRenderMap = computed(
    (): ReadonlyMap<string, TemplateRef<unknown>> => {
      const map = new Map<string, TemplateRef<unknown>>();

      for (const dir of this.cellRenderDirectives()) {
        map.set(dir.mznTableCellRender(), dir.templateRef);
      }

      return map;
    },
  );

  private readonly hostEl = inject(ElementRef<HTMLElement>);

  /** Pointer move handler kept so it can be removed after drag. */
  private boundPointerMove: ((e: PointerEvent) => void) | null = null;
  /** Pointer up handler kept so it can be removed after drag. */
  private boundPointerUp: ((e: PointerEvent) => void) | null = null;

  /* ---------------------------------------------------------------- */
  /*  Static class names (never change)                                */
  /* ---------------------------------------------------------------- */

  protected readonly headerClass = tableClasses.header;
  protected readonly headerCellContentClass = tableClasses.headerCellContent;
  protected readonly headerCellActionsBaseClass =
    tableClasses.headerCellActions;
  protected readonly headerCellTitleClass = tableClasses.headerCellTitle;
  protected readonly bodyClass = tableClasses.body;
  protected readonly cellContentClass = tableClasses.cellContent;
  protected readonly selectionCellClass = tableClasses.selectionCell;
  protected readonly bodySelectionCellClass = clsx(
    tableClasses.cell,
    tableClasses.selectionCell,
  );
  protected readonly headerSelectionCellClass = clsx(
    tableClasses.headerCell,
    tableClasses.selectionCell,
  );
  protected readonly selectionCheckboxClass = tableClasses.selectionCheckbox;
  protected readonly expandCellClass = tableClasses.expandCell;
  protected readonly bodyExpandCellClass = clsx(
    tableClasses.cell,
    tableClasses.expandCell,
  );
  protected readonly headerExpandCellClass = clsx(
    tableClasses.headerCell,
    tableClasses.expandCell,
  );
  protected readonly expandedRowClass = tableClasses.expandedRow;
  protected readonly expandedRowCellClass = tableClasses.expandedRowCell;
  protected readonly expandedContentClass = tableClasses.expandedContent;
  protected readonly collectHandleIconClass = tableClasses.collectHandleIcon;
  protected readonly dragOrPinHandleClass = tableClasses.dragOrPinHandle;
  protected readonly dragOrPinHandleCellClass =
    tableClasses.dragOrPinHandleCell;
  protected readonly emptyClass = tableClasses.empty;
  /** Pagination wrapper class — not in core, defined locally. */
  protected readonly paginationWrapperClass = `${tableClasses.root}__pagination`;
  protected readonly emptyRowClass = tableClasses.emptyRow;
  protected readonly pinHandleIconClass = tableClasses.pinHandleIcon;
  protected readonly resizeHandleClass = tableClasses.resizeHandle;
  protected readonly sortIconsClass = tableClasses.sortIcons;

  protected readonly cellClass = tableClasses.cell;
  protected readonly headerCellClass = tableClasses.headerCell;
  protected readonly actionsCellClass = tableClasses.actionsCell;
  protected readonly actionButtonClass = `${tableClasses.actionsCell}__button`;

  protected readonly caretDownIcon = CaretDownIcon;
  protected readonly caretUpIcon = CaretUpIcon;
  protected readonly chevronRightIcon = ChevronRightIcon;
  protected readonly dotDragVerticalIcon = DotDragVerticalIcon;
  protected readonly pinFilledIcon = PinFilledIcon;
  protected readonly pinIcon = PinIcon;
  protected readonly starFilledIcon = StarFilledIcon;
  protected readonly starOutlineIcon = StarOutlineIcon;

  /* ---------------------------------------------------------------- */
  /*  Computed host / root classes                                     */
  /* ---------------------------------------------------------------- */

  protected readonly hostClasses = computed((): string =>
    clsx(tableClasses.host, {
      [tableClasses.sticky]: this.nested(),
    }),
  );

  protected readonly hostStyles = computed((): Record<string, string> => {
    const min = this.minHeight();

    if (min == null) return {};

    return { 'min-height': typeof min === 'number' ? `${min}px` : min };
  });

  /**
   * Resolves the vertical scroll constraint from the `scroll` input.
   * Returns a CSS string (e.g. `'400px'` or `'50vh'`) or `null` when not set.
   */
  protected readonly scrollMaxHeight = computed((): string | null => {
    const s = this.scroll();

    if (s?.y == null) return null;

    return typeof s.y === 'number' ? `${s.y}px` : s.y;
  });

  protected readonly rootClasses = computed((): string =>
    clsx(tableClasses.root, {
      [tableClasses.main]: this.size() === 'main',
      [tableClasses.sub]: this.size() === 'sub',
      // sticky class lives on the scrollbar wrapper to mirror React DOM
    }),
  );

  /**
   * 依 `rowHeightPreset` 與 `size` 解析成對應的 `--mzn-spacing-size-*` CSS 變數。
   *
   * 對齊 React `Table.tsx` 的 rowHeight useMemo:
   *   base      → main: container-minimized   / sub: container-minimal
   *   condensed → main: container-condensed   / sub: container-reduced
   *   detailed  → main: container-tiny        / sub: container-tightened
   *   roomy     → main: container-small       / sub: container-medium
   *
   * 我們回傳 CSS var() 字串讓瀏覽器解析，不走 React 的 getComputedStyle 讀值邏輯。
   */
  protected readonly resolvedRowHeight = computed((): string => {
    const preset = this.rowHeightPreset();
    const isMain = this.size() === 'main';

    const token = ((): string => {
      switch (preset) {
        case 'condensed':
          return isMain ? 'container-condensed' : 'container-reduced';
        case 'detailed':
          return isMain ? 'container-tiny' : 'container-tightened';
        case 'roomy':
          return isMain ? 'container-small' : 'container-medium';
        case 'base':
        default:
          return isMain ? 'container-minimized' : 'container-minimal';
      }
    })();

    return `var(--mzn-spacing-size-${token})`;
  });

  /* ---------------------------------------------------------------- */
  /*  Computed selection helpers                                       */
  /* ---------------------------------------------------------------- */

  /** Whether any form of row selection is active. */
  protected readonly hasSelection = computed((): boolean => {
    const rs = this.rowSelection();

    return rs === true || (typeof rs === 'object' && rs !== null);
  });

  /** The selection mode (checkbox or radio). Defaults to checkbox. */
  protected readonly selectionMode = computed((): 'checkbox' | 'radio' => {
    const rs = this.rowSelection();

    if (typeof rs === 'object' && rs !== null && 'mode' in rs) {
      return rs.mode;
    }

    return 'checkbox';
  });

  /** Whether to hide the select-all checkbox in the header. */
  protected readonly hideSelectAll = computed((): boolean => {
    const rs = this.rowSelection();

    if (typeof rs === 'object' && rs !== null && 'hideSelectAll' in rs) {
      return rs.hideSelectAll ?? false;
    }

    return false;
  });

  protected readonly isDragEnabled = computed(
    (): boolean => this.draggable()?.enabled === true,
  );

  protected readonly isPinEnabled = computed(
    (): boolean => this.pinnable()?.enabled === true,
  );

  protected readonly totalColumns = computed((): number => {
    let count = this.columns().length;

    if (this.isDragEnabled() || this.isPinEnabled()) count += 1;
    if (this.hasSelection()) count += 1;
    if (this.isExpandableEnabled()) count += 1;
    if (this.collectable()?.enabled) count += 1;
    if (this.toggleable()?.enabled) count += 1;
    if (this.actions()) count += 1;

    return count;
  });

  protected isDragDisabled(record: TableDataSource): boolean {
    const drag = this.draggable();

    if (!drag?.enabled) return true;

    const key = getRowKey(record);

    return drag.fixedRowKeys?.includes(key) ?? false;
  }

  /**
   * Keys of rows that are actually selectable — excludes rows whose
   * `isSelectionDisabled(record)` returns true. Mirrors React
   * `useTableSelection.selectableKeys`, which determines:
   *   - `isAllSelected` / `isIndeterminate`
   *   - `toggleAll`'s target set
   * so the header checkbox never toggles disabled rows on or off.
   */
  private readonly selectableRowKeys = computed((): readonly string[] => {
    const rs = this.rowSelection();
    const isDisabled =
      typeof rs === 'object' && rs !== null && 'isSelectionDisabled' in rs
        ? rs.isSelectionDisabled
        : undefined;

    const records = this.dataSource();

    if (!isDisabled) return records.map(getRowKey).filter(Boolean);

    return records
      .filter((record) => !isDisabled(record))
      .map(getRowKey)
      .filter(Boolean);
  });

  protected readonly allSelected = computed((): boolean => {
    const keys = this.selectableRowKeys();
    const selected = this.resolvedSelectedKeys();

    return keys.length > 0 && keys.every((k) => selected.has(k));
  });

  protected readonly someSelected = computed((): boolean => {
    const keys = this.selectableRowKeys();
    const selected = this.resolvedSelectedKeys();
    const count = keys.filter((k) => selected.has(k)).length;

    return count > 0 && count < keys.length;
  });

  private readonly resolvedSelectedKeys = computed((): ReadonlySet<string> => {
    const rs = this.rowSelection();

    // Config object: use selectedRowKeys from config
    if (typeof rs === 'object' && rs !== null && 'mode' in rs) {
      if (rs.mode === 'checkbox' && 'selectedRowKeys' in rs) {
        return new Set(rs.selectedRowKeys);
      }

      if (rs.mode === 'radio' && 'selectedRowKey' in rs) {
        return rs.selectedRowKey ? new Set([rs.selectedRowKey]) : new Set();
      }
    }

    // Fallback: use the standalone selectedRowKeys input or internal state
    const controlled = this.selectedRowKeys();

    return controlled.length > 0
      ? new Set(controlled)
      : this.internalSelectedKeys();
  });

  /* ---------------------------------------------------------------- */
  /*  Class builders                                                   */
  /* ---------------------------------------------------------------- */

  protected getHeaderCellClasses(_col: TableColumn): string {
    return tableClasses.headerCell;
  }

  protected getHeaderCellActionsClasses(col: TableColumn): string {
    return clsx(
      tableClasses.headerCellActions,
      CELL_ALIGN_MAP[col.align ?? 'start'],
    );
  }

  protected getCellClasses(_col: TableColumn): string {
    return tableClasses.cell;
  }

  protected getCellContentClasses(col: TableColumn): string {
    const ellipsis = col.ellipsis ?? true;

    return clsx(
      tableClasses.cellContent,
      CELL_ALIGN_MAP[col.align ?? 'start'],
      {
        [tableClasses.cellEllipsis]: ellipsis,
      },
    );
  }

  protected getRowClasses(record: TableDataSource, index: number): string {
    const key = getRowKey(record);
    const ts = this.transitionState();
    const state = this.getRowState(record);
    const sep = this.separatorAtRowIndexes();

    return clsx(tableClasses.bodyRow, {
      [tableClasses.bodyRowHighlight]: this.isRowHighlighted(index),
      [tableClasses.bodyRowSelected]: this.resolvedSelectedKeys().has(key),
      [tableClasses.bodyRowZebra]: this.zebraStriping() && index % 2 === 1,
      [tableClasses.bodyRowAdding]: ts?.addingKeys.has(key) ?? false,
      [tableClasses.bodyRowDeleting]: ts?.deletingKeys.has(key) ?? false,
      [tableClasses.bodyRowFadingOut]: ts?.fadingOutKeys.has(key) ?? false,
      [tableClasses.bodyRowSeparator]: sep?.includes(index) ?? false,
      [tableClasses.bodyRowStateAdded]: state === 'added',
      [tableClasses.bodyRowStateDeleted]: state === 'deleted',
      [tableClasses.bodyRowStateDisabled]: state === 'disabled',
    });
  }

  /**
   * Row highlight matches React `useMemo` in `TableRow.tsx`:
   * only `'row'` and `'cross'` highlight modes light up the row when hovered.
   */
  protected isRowHighlighted(rowIndex: number): boolean {
    const hoveredRow = this.hoveredRowIndex();

    if (hoveredRow === null) return false;

    const mode = this.highlight();

    return (mode === 'row' || mode === 'cross') && hoveredRow === rowIndex;
  }

  /**
   * Cell highlight matches React `useMemo` in `TableCell.tsx`:
   * `'cell'` lights up a single cell at the hovered intersection;
   * `'column'` / `'cross'` light up the whole column on hover.
   */
  protected isCellHighlighted(rowIndex: number, columnIndex: number): boolean {
    const hoveredRow = this.hoveredRowIndex();
    const hoveredCol = this.hoveredColumnIndex();

    if (hoveredRow === null || hoveredCol === null) return false;

    switch (this.highlight()) {
      case 'cell':
        return hoveredRow === rowIndex && hoveredCol === columnIndex;
      case 'column':
      case 'cross':
        return hoveredCol === columnIndex;
      default:
        return false;
    }
  }

  protected onCellMouseEnter(rowIndex: number, columnIndex: number): void {
    this.hoveredRowIndex.set(rowIndex);
    this.hoveredColumnIndex.set(columnIndex);
  }

  protected onRowMouseLeave(): void {
    this.hoveredRowIndex.set(null);
    this.hoveredColumnIndex.set(null);
  }

  private getRowState(record: TableDataSource): string | undefined {
    const rs = this.rowState();

    if (typeof rs === 'function') return rs(record);

    return rs;
  }

  protected getSortIconClass(col: TableColumn, direction: SortOrder): string {
    return clsx(tableClasses.sortIcon, {
      [tableClasses.sortIconActive]: col.sortOrder === direction,
    });
  }

  /**
   * Expanded-row wrapper classes — mirrors React `TableExpandedRow.tsx` which
   * checks the parent row's key against `transitionState` so the expanded
   * content shares the same add/delete/fade animation as its parent row.
   * This delivers the "parent delete also highlights the expanded region"
   * behavior.
   */
  protected getExpandedRowClasses(record: TableDataSource): string {
    const key = getRowKey(record);
    const ts = this.transitionState();

    return clsx(tableClasses.expandedRow, {
      [tableClasses.expandedRowAdding]: ts?.addingKeys.has(key) ?? false,
      [tableClasses.expandedRowDeleting]: ts?.deletingKeys.has(key) ?? false,
      [tableClasses.expandedRowFadingOut]: ts?.fadingOutKeys.has(key) ?? false,
    });
  }

  protected getExpandIconClasses(record: TableDataSource): string {
    return clsx(tableClasses.expandIcon, {
      [tableClasses.expandIconExpanded]: this.isExpanded(record),
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Queries                                                          */
  /* ---------------------------------------------------------------- */

  /** Helper for templates — exposes `getRowKey` as an instance method. */
  protected getRowKeyOf(record: TableDataSource): string {
    return getRowKey(record);
  }

  /**
   * Current selected radio value — reads `rowSelection.selectedRowKey` in
   * config-object mode, otherwise falls back to the first key of the
   * internal selected set. Feeds the `<div mznRadio [ngModel]>` binding so
   * the checked radio is determined by value match (not boolean).
   */
  protected readonly selectedRadioValue = computed((): string | undefined => {
    const rs = this.rowSelection();

    if (
      typeof rs === 'object' &&
      rs !== null &&
      'mode' in rs &&
      rs.mode === 'radio'
    ) {
      return (rs as TableRowSelection & { mode: 'radio' }).selectedRowKey;
    }

    const set = this.resolvedSelectedKeys();

    return set.size > 0 ? [...set][0] : undefined;
  });

  /**
   * Forward MznRadio's `ngModelChange` (new value string) to the
   * existing `onToggleSelection(record)` handler by locating the record
   * that matches the new key.
   */
  protected onRadioNgModelChange(newKey: string | undefined): void {
    if (!newKey) return;

    const record = this.dataSource().find((r) => getRowKey(r) === newKey);

    if (record) this.onToggleSelection(record);
  }

  protected isSelected(record: TableDataSource): boolean {
    return this.resolvedSelectedKeys().has(getRowKey(record));
  }

  protected isSelectionDisabled(record: TableDataSource): boolean {
    const rs = this.rowSelection();

    if (typeof rs === 'object' && rs !== null && 'isSelectionDisabled' in rs) {
      return rs.isSelectionDisabled?.(record) ?? false;
    }

    return false;
  }

  protected isExpanded(record: TableDataSource): boolean {
    return this.internalExpandedKeys().has(getRowKey(record));
  }

  protected getCellValue(record: TableDataSource, col: TableColumn): string {
    const value = col.dataIndex ? record[col.dataIndex] : record[col.key];

    return value != null ? String(value) : '';
  }

  protected trackByRowKey(_index: number, record: TableDataSource): string {
    return getRowKey(record);
  }

  protected formatWidth(width: number | string | undefined): string | null {
    if (width == null) return null;

    return typeof width === 'number' ? `${width}px` : width;
  }

  protected formatEmptyHeight(
    height: number | string | undefined,
  ): string | null {
    if (height == null) return null;

    return typeof height === 'number' ? `${height}px` : height;
  }

  /**
   * Returns the effective width for a column, respecting any resized override
   * and falling back to the container-aware `resolvedColumnWidths` map so the
   * table fills its container and flex columns receive the remaining space —
   * mirroring React `calculateColumnWidths`.
   */
  protected getColWidth(col: TableColumn, colIndex: number): string | null {
    const overrideKey = `${col.key}_${colIndex}`;
    const overrideWidth = this.resizedWidths().get(overrideKey);

    if (overrideWidth != null) return `${overrideWidth}px`;

    const resolved = this.resolvedColumnWidths().get(col.key);

    if (resolved != null) return `${resolved}px`;

    return this.formatWidth(col.width);
  }

  /**
   * Action column width total (drag/pin handle + expansion + selection).
   * Mirrors React TableColGroup `actionColumnsWidth` useMemo.
   */
  private readonly actionColumnsWidth = computed((): number => {
    let w = 0;

    if (this.isDragEnabled() || this.isPinEnabled()) w += 40;
    if (this.isExpandableEnabled()) w += 40;
    if (this.hasSelection()) w += 40;

    return w;
  });

  /**
   * Right-control column (collectable / toggleable / actions) widths.
   * They live **inside** `columns()` as reserved keys in React's
   * `columnsWithRightControls`; Angular renders them outside `columns()`,
   * so subtract their explicit widths from the available space.
   */
  private readonly rightControlColumnsWidth = computed((): number => {
    let w = 0;
    const coll = this.collectable();
    const tog = this.toggleable();
    const act = this.actions();

    if (coll?.enabled) w += coll.minWidth ?? 80;
    if (tog?.enabled) w += tog.minWidth ?? 80;

    if (act) {
      const aw =
        typeof act.width === 'number'
          ? act.width
          : act.width
            ? parseFloat(String(act.width))
            : 0;

      w += aw;
    }

    return w;
  });

  /**
   * Resolved px widths for data columns, given container width and each
   * column's explicit/min/max constraints. Mirrors React
   * `utils/calculateColumnWidths.ts`.
   */
  protected readonly resolvedColumnWidths = computed(
    (): ReadonlyMap<string, number> => {
      const map = new Map<string, number>();
      const cw = this.containerWidth();
      const cols = this.columns();

      if (cw <= 0 || cols.length === 0 || this.nested()) {
        return map;
      }

      const available =
        cw - this.actionColumnsWidth() - this.rightControlColumnsWidth();

      if (available <= 0) return map;

      let totalFixed = 0;
      const flex: TableColumn[] = [];

      const clamp = (w: number, col: TableColumn): number => {
        let r = w;

        if (col.minWidth !== undefined && r < col.minWidth) r = col.minWidth;
        if (col.maxWidth !== undefined && r > col.maxWidth) r = col.maxWidth;

        return r;
      };

      cols.forEach((col, index) => {
        const resizedKey = `${col.key}_${index}`;
        const resized = this.resizedWidths().get(resizedKey);

        if (resized !== undefined) {
          map.set(col.key, resized);
          totalFixed += resized;
        } else if (col.width !== undefined) {
          const w =
            typeof col.width === 'number'
              ? col.width
              : parseFloat(String(col.width));
          const clamped = clamp(w, col);

          map.set(col.key, clamped);
          totalFixed += clamped;
        } else {
          flex.push(col);
        }
      });

      if (flex.length > 0) {
        const avg = (available - totalFixed) / flex.length;

        for (const col of flex) {
          map.set(col.key, clamp(avg, col));
        }
      }

      return map;
    },
  );

  /* ---------------------------------------------------------------- */
  /*  Collectable queries                                              */
  /* ---------------------------------------------------------------- */

  /**
   * Inner cell-content div on an actions `<td>` mirrors React's
   * `<div className={cx(classes.cellContent, alignClass)}>` with the
   * align class defaulting to the actions column's `align ?? 'end'`.
   */
  protected getActionsCellContentClasses(actions: TableActions): string {
    return clsx(
      tableClasses.cellContent,
      CELL_ALIGN_MAP[actions.align ?? 'end'],
    );
  }

  /**
   * Header-cell actions wrapper for the actions column. React's
   * `columnsWithRightControls` in `Table.tsx` pushes the actions column
   * into `columns` with `align: actions.align ?? 'end'`, so the shared
   * `TableHeader` path renders it with align-end by default; mirror here.
   */
  protected getActionsHeaderActionsClasses(actions: TableActions): string {
    return clsx(
      tableClasses.headerCellActions,
      CELL_ALIGN_MAP[actions.align ?? 'end'],
    );
  }

  /**
   * Resolve the variant applied to a single row action button.
   *
   * Priority mirrors React `TableActionsCell.tsx`:
   *   item.variant → actions.variant → `danger` legacy fallback → `base-text-link`.
   */
  protected resolveActionVariant(
    item: TableActionItem,
    actions: TableActions,
  ): TableActionVariant {
    if (item.variant) return item.variant;

    if (actions.variant) return actions.variant;

    if (item.danger) return 'destructive-text-link';

    return 'base-text-link';
  }

  protected isCollected(record: TableDataSource): boolean {
    const rowKey = getRowKey(record);

    return this.collectable()?.collectedRowKeys?.includes(rowKey) ?? false;
  }

  protected isCollectDisabled(record: TableDataSource): boolean {
    return this.collectable()?.isRowDisabled?.(record) ?? false;
  }

  /* ---------------------------------------------------------------- */
  /*  Toggleable queries                                               */
  /* ---------------------------------------------------------------- */

  protected isToggled(record: TableDataSource): boolean {
    const rowKey = getRowKey(record);

    return this.toggleable()?.toggledRowKeys?.includes(rowKey) ?? false;
  }

  protected isToggleDisabled(record: TableDataSource): boolean {
    return this.toggleable()?.isRowDisabled?.(record) ?? false;
  }

  /* ---------------------------------------------------------------- */
  /*  Pinnable queries                                                 */
  /* ---------------------------------------------------------------- */

  protected isPinned(record: TableDataSource): boolean {
    const rowKey = getRowKey(record);

    return this.pinnable()?.pinnedRowKeys?.includes(rowKey) ?? false;
  }

  /* ---------------------------------------------------------------- */
  /*  Event handlers                                                   */
  /* ---------------------------------------------------------------- */

  protected onSort(col: TableColumn): void {
    const order = nextSortOrder(col.sortOrder ?? null);

    col.onSort?.(col.key, order);
    this.sortChange.emit({ key: col.key, order });
  }

  /**
   * Click handler for the sort-icon button. Mirrors React's `TableHeader`
   * where the button's `onClick` stops propagation so clicking the sort
   * control does not bubble up to an ancestor row handler.
   */
  protected onSortIconClick(event: Event, col: TableColumn): void {
    event.stopPropagation();
    this.onSort(col);
  }

  /**
   * Keyboard handler — Enter / Space trigger sort, matching React's
   * `TableHeader.onKeyDown` which prevents default to suppress page scroll
   * and stops propagation so the handler does not bubble.
   */
  protected onSortIconKeyDown(event: KeyboardEvent, col: TableColumn): void {
    event.stopPropagation();

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSort(col);
    }
  }

  onToggleSelection(record: TableDataSource): void {
    const key = getRowKey(record);
    const rs = this.rowSelection();

    // Config object mode
    if (typeof rs === 'object' && rs !== null && 'mode' in rs) {
      if (rs.mode === 'radio') {
        const radioConfig = rs as TableRowSelection & { mode: 'radio' };
        const isAlreadySelected = radioConfig.selectedRowKey === key;

        radioConfig.onChange(
          isAlreadySelected ? undefined : key,
          isAlreadySelected ? null : record,
        );

        return;
      }

      if (rs.mode === 'checkbox') {
        const checkboxConfig = rs as TableRowSelection & { mode: 'checkbox' };
        const currentKeys = [...checkboxConfig.selectedRowKeys];
        const idx = currentKeys.indexOf(key);

        if (idx >= 0) {
          currentKeys.splice(idx, 1);
        } else {
          currentKeys.push(key);
        }

        const selectedRows = this.dataSource().filter((r) =>
          currentKeys.includes(getRowKey(r)),
        );

        checkboxConfig.onChange(currentKeys, record, selectedRows);

        return;
      }
    }

    // Simple boolean mode: use internal state
    const current = new Set(this.internalSelectedKeys());

    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }

    this.internalSelectedKeys.set(current);
    this.selectedRowKeysChange.emit([...current]);
  }

  /**
   * Toggle the header "select all" checkbox. Mirrors React
   * `useTableSelection.toggleAll`:
   *
   * - When `isAllSelected`:
   *   - `preserveSelectedRowKeys=true`  → drop every key belonging to the
   *     current `dataSource` (regardless of `isSelectionDisabled`).
   *   - `preserveSelectedRowKeys=false` → drop only the `selectableRowKeys`
   *     in the current page; other pages' keys stay untouched.
   * - When not `isAllSelected`:
   *   - `preserveSelectedRowKeys=true`  → keep selectedRowKeys whose rows
   *     are **not** in the current `dataSource`, then append the current
   *     page's `selectableRowKeys`.
   *   - `preserveSelectedRowKeys=false` → replace with the current page's
   *     `selectableRowKeys` only.
   */
  onSelectAll(_keys?: readonly string[]): void {
    const selectable = this.selectableRowKeys();
    const selected = this.resolvedSelectedKeys();
    const currentDataKeys = this.dataSource().map(getRowKey);
    const rs = this.rowSelection();
    const preserve =
      typeof rs === 'object' &&
      rs !== null &&
      'mode' in rs &&
      rs.mode === 'checkbox'
        ? ((rs as TableRowSelectionCheckbox).preserveSelectedRowKeys ?? false)
        : false;

    const selectedArr = [...selected];

    let nextKeys: string[];
    let type: 'all' | 'none';

    if (this.allSelected()) {
      type = 'none';

      if (preserve) {
        nextKeys = selectedArr.filter((k) => !currentDataKeys.includes(k));
      } else {
        nextKeys = selectedArr.filter((k) => !selectable.includes(k));
      }
    } else {
      type = 'all';

      const existingNonDataKeys = preserve
        ? selectedArr.filter((k) => !currentDataKeys.includes(k))
        : [];

      nextKeys = [...existingNonDataKeys, ...selectable];
    }

    // Config object mode.
    if (
      typeof rs === 'object' &&
      rs !== null &&
      'mode' in rs &&
      rs.mode === 'checkbox'
    ) {
      const checkboxConfig = rs as TableRowSelectionCheckbox;
      const selectedRows = this.dataSource().filter((r) =>
        nextKeys.includes(getRowKey(r)),
      );

      checkboxConfig.onChange(nextKeys, null, selectedRows);
      checkboxConfig.onSelectAll?.(type);

      return;
    }

    // Plain boolean `rowSelection` / standalone `selectedRowKeys` input mode.
    this.internalSelectedKeys.set(new Set(nextKeys));
    this.selectedRowKeysChange.emit(nextKeys);
  }

  onToggleExpansion(record: TableDataSource): void {
    if (!this.canExpandRow(record)) return;

    const key = getRowKey(record);
    const current = new Set(this.internalExpandedKeys());
    const willExpand = !current.has(key);

    if (willExpand) {
      current.add(key);
    } else {
      current.delete(key);
    }

    this.internalExpandedKeys.set(current);
    const nextKeys = [...current];
    this.expandedRowKeysChange.emit(nextKeys);

    const config = this.expandableConfig();
    config?.onExpand?.(willExpand, record);
    config?.onExpandedRowsChange?.(nextKeys);
  }

  /** Phase 3A #3: respect `TableExpandable.rowExpandable` predicate. */
  protected canExpandRow(record: TableDataSource): boolean {
    const config = this.expandableConfig();
    if (!config) return false;
    return config.rowExpandable?.(record) ?? true;
  }

  /**
   * Click handler for the expand icon button; mirrors React's
   * `TableExpandCell` where the `<button>` toggles expansion and stops
   * propagation so the surrounding `<tr (click)>` does not also fire.
   */
  protected onExpandIconClick(event: Event, record: TableDataSource): void {
    if (!this.canExpandRow(record)) return;
    event.stopPropagation();
    this.onToggleExpansion(record);
  }

  protected onRowClick(_record: TableDataSource): void {
    // Reserved for future row-click handling.
  }

  protected onDrop(event: CdkDragDrop<readonly TableDataSource[]>): void {
    const drag = this.draggable();

    if (!drag?.enabled) return;

    const { previousIndex, currentIndex } = event;

    if (previousIndex === currentIndex) return;

    const newData = [...this.dataSource()];
    const draggingRecord = newData[previousIndex];
    const draggingId = getRowKey(draggingRecord);

    moveItemInArray(newData, previousIndex, currentIndex);
    drag.onDragEnd?.(newData, {
      draggingId,
      fromIndex: previousIndex,
      toIndex: currentIndex,
    });
  }

  protected onDragStarted(event: CdkDragStart): void {
    const row = event.source.element.nativeElement as HTMLElement;

    row.querySelectorAll('td, th').forEach((cell) => {
      const el = cell as HTMLElement;

      el.style.width = `${el.getBoundingClientRect().width}px`;
      el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    });
  }

  protected onDragEnded(event: CdkDragEnd): void {
    const row = event.source.element.nativeElement as HTMLElement;

    row.querySelectorAll('td, th').forEach((cell) => {
      const el = cell as HTMLElement;

      el.style.width = '';
      el.style.minWidth = '';
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Collectable handler                                              */
  /* ---------------------------------------------------------------- */

  protected onCollectClick(record: TableDataSource): void {
    const c = this.collectable();

    if (!c?.enabled) return;

    const collected = this.isCollected(record);

    c.onCollectChange?.(record, !collected);
  }

  /* ---------------------------------------------------------------- */
  /*  Toggleable handler                                               */
  /* ---------------------------------------------------------------- */

  protected onToggleClick(record: TableDataSource, event: MouseEvent): void {
    event.stopPropagation();
    const t = this.toggleable();

    if (!t?.enabled || this.isToggleDisabled(record)) return;

    const toggled = this.isToggled(record);

    t.onToggleChange?.(record, !toggled);
  }

  /* ---------------------------------------------------------------- */
  /*  Pinnable handler                                                 */
  /* ---------------------------------------------------------------- */

  protected onPinClick(record: TableDataSource): void {
    const p = this.pinnable();

    if (!p?.enabled) return;

    const pinned = this.isPinned(record);

    p.onPinChange?.(record, !pinned);
  }

  /* ---------------------------------------------------------------- */
  /*  Pagination handler                                               */
  /* ---------------------------------------------------------------- */

  protected onPaginationChange(page: number): void {
    this.pagination()?.onChange?.(page);
  }

  /* ---------------------------------------------------------------- */
  /*  Resizable handlers                                               */
  /* ---------------------------------------------------------------- */

  protected onResizeStart(event: PointerEvent, colIndex: number): void {
    event.preventDefault();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    this.resizingColIndex.set(colIndex);
    this.resizeStartX.set(event.clientX);

    // Snapshot current widths from DOM col elements
    const cols = Array.from(
      this.hostEl.nativeElement.querySelectorAll('table col'),
    ) as HTMLElement[];
    const startWidths = new Map<string, number>();
    const colDefs = this.columns();

    cols.forEach((col: HTMLElement, idx: number) => {
      const colDef = colDefs[idx];

      if (colDef) {
        const key = `${colDef.key}_${idx}`;
        const currentOverride = this.resizedWidths().get(key);
        const width = currentOverride ?? col.getBoundingClientRect().width;

        startWidths.set(key, width);
      }
    });
    this.resizeStartWidths.set(startWidths);

    this.boundPointerMove = (e: PointerEvent): void =>
      this.onResizeMove(e, colIndex);
    this.boundPointerUp = (e: PointerEvent): void => this.onResizeEnd(e);

    document.addEventListener('pointermove', this.boundPointerMove);
    document.addEventListener('pointerup', this.boundPointerUp);
  }

  private onResizeMove(event: PointerEvent, colIndex: number): void {
    const delta = event.clientX - this.resizeStartX();
    const colDefs = this.columns();
    const currentCol = colDefs[colIndex];

    if (!currentCol) return;

    const startWidths = this.resizeStartWidths();
    const currentKey = `${currentCol.key}_${colIndex}`;
    const currentStartWidth = startWidths.get(currentKey) ?? 100;
    const minCurrent = (currentCol as { minWidth?: number }).minWidth ?? 40;
    const newCurrentWidth = Math.max(minCurrent, currentStartWidth + delta);

    const updated = new Map(this.resizedWidths());

    updated.set(currentKey, newCurrentWidth);

    // Adjust next column in opposite direction
    const nextCol = colDefs[colIndex + 1];

    if (nextCol) {
      const nextKey = `${nextCol.key}_${colIndex + 1}`;
      const nextStartWidth = startWidths.get(nextKey) ?? 100;
      const minNext = (nextCol as { minWidth?: number }).minWidth ?? 40;
      const widthDiff = newCurrentWidth - currentStartWidth;
      const newNextWidth = Math.max(minNext, nextStartWidth - widthDiff);

      updated.set(nextKey, newNextWidth);
    }

    this.resizedWidths.set(updated);
  }

  private onResizeEnd(_event: PointerEvent): void {
    this.resizingColIndex.set(null);

    if (this.boundPointerMove) {
      document.removeEventListener('pointermove', this.boundPointerMove);
      this.boundPointerMove = null;
    }

    if (this.boundPointerUp) {
      document.removeEventListener('pointerup', this.boundPointerUp);
      this.boundPointerUp = null;
    }
  }
}
