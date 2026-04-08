import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
  DotDragVerticalIcon,
  PinFilledIcon,
  PinIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from '@mezzanine-ui/icons';
import { MznEmpty } from '@mezzanine-ui/ng/empty';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPagination } from '@mezzanine-ui/ng/pagination';
import { MznToggle } from '@mezzanine-ui/ng/toggle';
import clsx from 'clsx';
import { MZN_TABLE_CONTEXT, type TableContextValue } from './table-context';
import {
  type ColumnAlign,
  type HighlightMode,
  type RowHeightPreset,
  type SortOrder,
  type TableActions,
  type TableCollectable,
  type TableColumn,
  type TableDataSource,
  type TableDraggable,
  type TableEmptyProps,
  type TablePagination,
  type TablePinnable,
  type TableRowSelection,
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
    MznEmpty,
    MznIcon,
    MznPagination,
    MznToggle,
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
    <!-- scroll wrapper: applies max-height when scroll.y is set -->
    <div
      [style.max-height]="scrollMaxHeight()"
      [style.overflow-y]="scrollMaxHeight() ? 'auto' : null"
    >
      <table [class]="rootClasses()">
        @if (showHeader()) {
          <thead [class]="headerClass">
            <tr>
              @if (isDragEnabled() || isPinEnabled()) {
                <th
                  [class]="dragOrPinHandleCellClass"
                  style="width: 40px;"
                ></th>
              }
              @if (hasSelection()) {
                <th [class]="selectionCellClass">
                  @if (selectionMode() === 'checkbox' && !hideSelectAll()) {
                    <input
                      type="checkbox"
                      [class]="selectionCheckboxClass"
                      [checked]="allSelected()"
                      [indeterminate]="someSelected()"
                      (change)="onSelectAll()"
                    />
                  }
                </th>
              }
              @if (expandable()) {
                <th [class]="expandCellClass"></th>
              }
              @for (col of columns(); track col.key; let colIndex = $index) {
                <th
                  [class]="getHeaderCellClasses(col)"
                  [style.width]="getColWidth(col, colIndex)"
                >
                  <span [class]="headerCellContentClass">
                    <span [class]="headerCellTitleClass">{{ col.title }}</span>
                    @if (col.sortOrder !== undefined) {
                      <span [class]="sortIconsClass" (click)="onSort(col)">
                        <span [class]="getSortIconClass(col, 'ascend')"
                          >&#9650;</span
                        >
                        <span [class]="getSortIconClass(col, 'descend')"
                          >&#9660;</span
                        >
                      </span>
                    }
                    @if (resizable()) {
                      <span
                        [class]="resizeHandleClass"
                        (pointerdown)="onResizeStart($event, colIndex)"
                      ></span>
                    }
                  </span>
                </th>
              }
              @if (collectable()?.enabled) {
                <th style="width: 80px;">
                  <span [class]="headerCellContentClass">
                    <span [class]="headerCellTitleClass">{{
                      collectable()!.title ?? '收藏'
                    }}</span>
                  </span>
                </th>
              }
              @if (toggleable()?.enabled) {
                <th style="width: 80px;">
                  <span [class]="headerCellContentClass">
                    <span [class]="headerCellTitleClass">{{
                      toggleable()!.title ?? ''
                    }}</span>
                  </span>
                </th>
              }
              @if (actions(); as act) {
                <th
                  [class]="actionsCellClass"
                  [style.width]="formatWidth(act.width)"
                >
                  <span [class]="headerCellContentClass">
                    <span [class]="headerCellTitleClass">{{
                      act.title ?? ''
                    }}</span>
                  </span>
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
              (click)="onRowClick(record)"
              cdkDrag
              [cdkDragDisabled]="!isDragEnabled() || isDragDisabled(record)"
              (cdkDragStarted)="onDragStarted($event)"
              (cdkDragEnded)="onDragEnded($event)"
            >
              @if (isDragEnabled()) {
                <td
                  [class]="dragOrPinHandleCellClass"
                  style="width: 40px;"
                  cdkDragHandle
                >
                  <span [class]="dragOrPinHandleClass">
                    <i mznIcon [icon]="dotDragVerticalIcon" color="neutral"></i>
                  </span>
                </td>
              } @else if (isPinEnabled()) {
                <td
                  [class]="dragOrPinHandleCellClass"
                  style="width: 40px;"
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
                <td [class]="selectionCellClass">
                  @if (selectionMode() === 'radio') {
                    <input
                      type="radio"
                      [class]="selectionCheckboxClass"
                      name="mzn-table-radio"
                      [checked]="isSelected(record)"
                      [disabled]="isSelectionDisabled(record)"
                      (change)="onToggleSelection(record)"
                    />
                  } @else {
                    <input
                      type="checkbox"
                      [class]="selectionCheckboxClass"
                      [checked]="isSelected(record)"
                      [disabled]="isSelectionDisabled(record)"
                      (change)="onToggleSelection(record)"
                    />
                  }
                </td>
              }
              @if (expandable()) {
                <td
                  [class]="expandCellClass"
                  (click)="onToggleExpansion(record); $event.stopPropagation()"
                >
                  <span [class]="getExpandIconClasses(record)">&#9654;</span>
                </td>
              }
              @for (col of columns(); track col.key; let colIndex = $index) {
                <td
                  [class]="getCellClasses(col)"
                  [style.width]="getColWidth(col, colIndex)"
                >
                  <span [class]="cellContentClass">{{
                    getCellValue(record, col)
                  }}</span>
                </td>
              }
              @if (collectable()?.enabled) {
                <td style="width: 80px;">
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
                <td style="width: 80px;">
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
                <td
                  [class]="actionsCellClass"
                  [style.width]="formatWidth(act.width)"
                >
                  <span [class]="cellContentClass">
                    @for (action of act.render(record, idx); track action.key) {
                      <button
                        type="button"
                        [class]="actionButtonClass"
                        [disabled]="action.disabled ?? false"
                        (click)="
                          action.onClick?.(record, idx);
                          $event.stopPropagation()
                        "
                      >
                        {{ action.label }}
                      </button>
                    }
                  </span>
                </td>
              }
            </tr>
            @if (expandable() && isExpanded(record)) {
              <tr [class]="expandedRowClass">
                <td
                  [attr.colspan]="totalColumns()"
                  [class]="expandedRowCellClass"
                >
                  <div [class]="expandedContentClass">
                    <!-- Expanded content placeholder -->
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
   * 是否啟用展開列功能。
   * @default false
   */
  readonly expandable = input(false);

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
   * 注意：React 的 virtualized 模式尚未在 Angular 實作 — 如需虛擬捲動請追蹤 TODO。
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
   * @default false
   */
  readonly sticky = input(false);

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
  protected readonly headerCellTitleClass = tableClasses.headerCellTitle;
  protected readonly bodyClass = tableClasses.body;
  protected readonly cellContentClass = tableClasses.cellContent;
  protected readonly selectionCellClass = tableClasses.selectionCell;
  protected readonly selectionCheckboxClass = tableClasses.selectionCheckbox;
  protected readonly expandCellClass = tableClasses.expandCell;
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

  protected readonly actionsCellClass = tableClasses.actionsCell;
  protected readonly actionButtonClass = `${tableClasses.actionsCell}__button`;

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
      [tableClasses.sticky]: this.sticky(),
      // TODO: apply resizable-specific class when core adds one
    }),
  );

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
    if (this.expandable()) count += 1;
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

  private readonly allRowKeys = computed((): readonly string[] =>
    this.dataSource().map(getRowKey).filter(Boolean),
  );

  protected readonly allSelected = computed((): boolean => {
    const keys = this.allRowKeys();
    const selected = this.resolvedSelectedKeys();

    return keys.length > 0 && keys.every((k) => selected.has(k));
  });

  protected readonly someSelected = computed((): boolean => {
    const keys = this.allRowKeys();
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

  protected getHeaderCellClasses(col: TableColumn): string {
    return clsx(
      tableClasses.headerCell,
      tableClasses.cell,
      col.align && CELL_ALIGN_MAP[col.align],
    );
  }

  protected getCellClasses(col: TableColumn): string {
    return clsx(
      tableClasses.bodyCell,
      tableClasses.cell,
      col.align && CELL_ALIGN_MAP[col.align],
    );
  }

  protected getRowClasses(record: TableDataSource, index: number): string {
    const key = getRowKey(record);
    const ts = this.transitionState();
    const state = this.getRowState(record);
    const sep = this.separatorAtRowIndexes();

    return clsx(tableClasses.bodyRow, {
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

  protected getExpandIconClasses(record: TableDataSource): string {
    return clsx(tableClasses.expandIcon, {
      [tableClasses.expandIconExpanded]: this.isExpanded(record),
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Queries                                                          */
  /* ---------------------------------------------------------------- */

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
   * Returns the effective width for a column, respecting any resized override.
   */
  protected getColWidth(col: TableColumn, colIndex: number): string | null {
    const overrideKey = `${col.key}_${colIndex}`;
    const overrideWidth = this.resizedWidths().get(overrideKey);

    if (overrideWidth != null) return `${overrideWidth}px`;

    return this.formatWidth(col.width);
  }

  /* ---------------------------------------------------------------- */
  /*  Collectable queries                                              */
  /* ---------------------------------------------------------------- */

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

  onSelectAll(keys?: readonly string[]): void {
    const allKeys = keys ?? this.allRowKeys();
    const rs = this.rowSelection();

    if (this.allSelected()) {
      // Config object mode
      if (
        typeof rs === 'object' &&
        rs !== null &&
        'mode' in rs &&
        rs.mode === 'checkbox'
      ) {
        const checkboxConfig = rs as TableRowSelection & { mode: 'checkbox' };

        checkboxConfig.onChange([], null, []);
        checkboxConfig.onSelectAll?.('none');

        return;
      }

      this.internalSelectedKeys.set(new Set());
      this.selectedRowKeysChange.emit([]);
    } else {
      // Config object mode
      if (
        typeof rs === 'object' &&
        rs !== null &&
        'mode' in rs &&
        rs.mode === 'checkbox'
      ) {
        const checkboxConfig = rs as TableRowSelection & { mode: 'checkbox' };
        const nextKeys = [...allKeys];
        const selectedRows = this.dataSource().filter((r) =>
          nextKeys.includes(getRowKey(r)),
        );

        checkboxConfig.onChange(nextKeys, null, selectedRows);
        checkboxConfig.onSelectAll?.('all');

        return;
      }

      const next = new Set(allKeys);

      this.internalSelectedKeys.set(next);
      this.selectedRowKeysChange.emit([...next]);
    }
  }

  onToggleExpansion(record: TableDataSource): void {
    const key = getRowKey(record);
    const current = new Set(this.internalExpandedKeys());

    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }

    this.internalExpandedKeys.set(current);
    this.expandedRowKeysChange.emit([...current]);
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
