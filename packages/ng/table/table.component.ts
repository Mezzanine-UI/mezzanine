import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  TemplateRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  CdkDragHandle,
  type CdkDragMove,
  CdkDragStart,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  CaretDownIcon,
  CaretUpIcon,
  ChevronRightIcon,
  CloseIcon,
  DotDragVerticalIcon,
  DotHorizontalIcon,
  DotVerticalIcon,
  PinFilledIcon,
  PinIcon,
  QuestionOutlineIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from '@mezzanine-ui/icons';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznCheckbox } from '@mezzanine-ui/ng/checkbox';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import { MznEmpty } from '@mezzanine-ui/ng/empty';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPagination } from '@mezzanine-ui/ng/pagination';
import { MznPortal } from '@mezzanine-ui/ng/portal';
import { MznRadio } from '@mezzanine-ui/ng/radio';
import { MznScrollbar } from '@mezzanine-ui/ng/scrollbar';
import { MznSkeleton } from '@mezzanine-ui/ng/skeleton';
import { MznToggle } from '@mezzanine-ui/ng/toggle';
import { MznTooltip } from '@mezzanine-ui/ng/tooltip';
import clsx from 'clsx';
import { MznTableCellRender } from './table-cell-render.directive';
import { MZN_TABLE_CONTEXT, type TableContextValue } from './table-context';
import {
  type ColumnAlign,
  type HighlightMode,
  type RowHeightPreset,
  type SortOrder,
  type TableActionButtonItem,
  type TableActionDropdownItem,
  type TableActionItem,
  type TableActions,
  type TableActionVariant,
  type TableBulkActions,
  type TableBulkGeneralAction,
  type TableBulkOverflowAction,
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
import {
  COLLECTABLE_COLUMN_WIDTH,
  COLLECTABLE_KEY,
  DRAG_OR_PIN_HANDLE_COLUMN_WIDTH,
  DRAG_OR_PIN_HANDLE_KEY,
  EXPANSION_COLUMN_WIDTH,
  EXPANSION_KEY,
  SELECTION_COLUMN_WIDTH,
  SELECTION_KEY,
  TABLE_ACTIONS_KEY,
  TOGGLEABLE_COLUMN_WIDTH,
  TOGGLEABLE_KEY,
  tableClasses,
} from '@mezzanine-ui/core/table';
import { calculateColumnWidths } from './calculate-column-widths';

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

/** Parse a CSS custom-property pixel string like `"24px"` → `24`. */
function parsePxVar(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const num = parseFloat(trimmed);

  return Number.isFinite(num) ? num : null;
}

/**
 * Minimal trailing-edge throttle based on timestamps. Mirrors the cadence
 * of `lodash.throttle(fn, wait)` used by React's `Table.tsx` — we purposely
 * avoid a lodash dependency on the Angular side.
 */
function throttleRaf(
  fn: () => void,
  wait: number,
): { readonly run: () => void; readonly cancel: () => void } {
  let last = 0;
  let pending: ReturnType<typeof setTimeout> | null = null;

  const run = (): void => {
    const now = Date.now();
    const remaining = wait - (now - last);

    if (remaining <= 0) {
      if (pending) {
        clearTimeout(pending);
        pending = null;
      }

      last = now;
      fn();
    } else if (!pending) {
      pending = setTimeout(() => {
        last = Date.now();
        pending = null;
        fn();
      }, remaining);
    }
  };

  const cancel = (): void => {
    if (pending) {
      clearTimeout(pending);
      pending = null;
    }
  };

  return { run, cancel };
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
    MznDropdown,
    MznEmpty,
    MznIcon,
    MznPagination,
    MznPortal,
    MznRadio,
    MznScrollbar,
    MznSkeleton,
    MznToggle,
    MznTooltip,
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
      (viewportReady)="onScrollViewportReady($event)"
    >
      <table
        [class]="rootClasses()"
        [style.width]="fullWidth() ? '100%' : null"
      >
        <colgroup>
          <!-- Column order: Expand, Drag/Pin, Selection, data columns, Collectable, Toggleable, Actions. Mirrors React TableRow renderExpandCell then renderDragOrPinHandleCell then renderSelectionCell then renderCells(). -->
          @if (isExpandableEnabled()) {
            <col style="width: 40px; min-width: 40px; max-width: 40px;" />
          }
          @if (isDragEnabled() || isPinEnabled()) {
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
          @if (toggleable(); as t) {
            @if (t.enabled) {
              <col
                [style.width.px]="t.minWidth ?? 80"
                [style.min-width.px]="t.minWidth ?? 80"
              />
            }
          }
          @if (collectable(); as c) {
            @if (c.enabled) {
              <col
                [style.width.px]="c.minWidth ?? 80"
                [style.min-width.px]="c.minWidth ?? 80"
              />
            }
          }
          @if (actions(); as act) {
            <col [style.width]="formatWidth(act.width)" />
          }
        </colgroup>
        @if (showHeader()) {
          <thead [class]="headerClass">
            <tr>
              @if (isExpandableEnabled()) {
                <th
                  [class]="headerExpandCellClass()"
                  [style]="expandCellStyle()"
                  scope="col"
                ></th>
              }
              @if (isDragEnabled() || isPinEnabled()) {
                <th
                  [class]="dragOrPinCellClass()"
                  [style]="dragOrPinCellStyle()"
                ></th>
              }
              @if (hasSelection()) {
                <th
                  [class]="headerSelectionCellClass()"
                  [style]="selectionCellStyle()"
                  scope="col"
                >
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
              @for (col of columns(); track col.key; let colIndex = $index) {
                <th
                  [class]="getHeaderCellClasses(col)"
                  [style]="fixedOffsetStyleMap().get(col.key) ?? {}"
                  scope="col"
                >
                  <div [class]="headerCellContentClass">
                    <div [class]="getHeaderCellActionsClasses(col)">
                      <span [class]="headerCellTitleClass">{{
                        col.title
                      }}</span>
                      @if (col.titleHelp) {
                        <i
                          mznIcon
                          [icon]="questionOutlineIcon"
                          [size]="16"
                          [class]="headerCellIconClass"
                          [mznTooltip]="col.titleHelp"
                          tabindex="0"
                        ></i>
                      }
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
                    @if (col.titleMenu; as tm) {
                      <span #titleMenuAnchor>
                        <i
                          mznIcon
                          [icon]="dotVerticalIcon"
                          [size]="16"
                          [class]="headerCellIconClass"
                          (click)="
                            onTitleMenuToggle(col.key); $event.stopPropagation()
                          "
                        ></i>
                      </span>
                      <div mznPortal>
                        <div
                          mznDropdown
                          [anchor]="titleMenuAnchor"
                          [maxHeight]="tm.maxHeight"
                          [open]="titleMenuOpenKey() === col.key"
                          [options]="tm.options"
                          [placement]="tm.placement ?? 'bottom-end'"
                          (selected)="onTitleMenuSelect(col, $event)"
                          (closed)="titleMenuOpenKey.set(null)"
                        ></div>
                      </div>
                    }
                  </div>
                  @if (resizable() && colIndex < columns().length - 1) {
                    <span
                      [class]="resizeHandleClass"
                      (pointerdown)="onResizeStart($event, colIndex)"
                    ></span>
                  }
                </th>
              }
              @if (toggleable()?.enabled) {
                <th
                  [class]="toggleableHeaderClass()"
                  [style]="toggleableCellStyle()"
                  scope="col"
                >
                  <div [class]="headerCellContentClass">
                    <div [class]="headerCellActionsBaseClass">
                      <span [class]="headerCellTitleClass">{{
                        toggleable()!.title ?? ''
                      }}</span>
                    </div>
                  </div>
                </th>
              }
              @if (collectable()?.enabled) {
                <th
                  [class]="collectableHeaderClass()"
                  [style]="collectableCellStyle()"
                  scope="col"
                >
                  <div [class]="headerCellContentClass">
                    <div [class]="headerCellActionsBaseClass">
                      <span [class]="headerCellTitleClass">{{
                        collectable()!.title ?? '收藏'
                      }}</span>
                    </div>
                  </div>
                </th>
              }
              @if (actions(); as act) {
                <th
                  [class]="getActionsHeaderCellClasses(act)"
                  [style]="getActionsFixedOffsetStyle(act)"
                  scope="col"
                >
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
          @if (dataSourceForRender().length === 0 && !loading()) {
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
            record of dataSourceForRender();
            track trackByRowKey($index, record);
            let idx = $index
          ) {
            <tr
              [class]="rowClassesMap().get(idx) ?? ''"
              [style.height]="resolvedRowHeight()"
              (click)="onRowClick(record)"
              (mouseleave)="onRowMouseLeave()"
              cdkDrag
              [cdkDragDisabled]="!isDragEnabled() || isDragDisabled(record)"
              [cdkDragPreviewClass]="dragPreviewClassNames"
              (cdkDragStarted)="onDragStarted($event)"
              (cdkDragEnded)="onDragEnded($event)"
              (cdkDragMoved)="onDragMoved($event)"
            >
              @if (isExpandableEnabled()) {
                <td [class]="bodyExpandCellClass()" [style]="expandCellStyle()">
                  @if (loading()) {
                    <span
                      mznSkeleton
                      width="100%"
                      variant="body-highlight"
                    ></span>
                  } @else if (canExpandRow(record)) {
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
              @if (isDragEnabled()) {
                <td
                  [class]="dragOrPinCellClass()"
                  [style]="dragOrPinCellStyle()"
                  cdkDragHandle
                >
                  @if (loading()) {
                    <span
                      mznSkeleton
                      width="100%"
                      variant="body-highlight"
                    ></span>
                  } @else {
                    <span [class]="dragOrPinHandleClass">
                      <i
                        mznIcon
                        [icon]="dotDragVerticalIcon"
                        color="neutral"
                      ></i>
                    </span>
                  }
                </td>
              } @else if (isPinEnabled()) {
                <td
                  [class]="dragOrPinCellClass()"
                  [style]="dragOrPinCellStyle()"
                >
                  @if (loading()) {
                    <span
                      mznSkeleton
                      width="100%"
                      variant="body-highlight"
                    ></span>
                  } @else {
                    <button
                      type="button"
                      [class]="pinHandleButtonClass"
                      [attr.aria-label]="
                        isPinned(record) ? 'Unpin row' : 'Pin row'
                      "
                      [attr.aria-pressed]="isPinned(record)"
                      (click)="onPinClick(record); $event.stopPropagation()"
                    >
                      <i
                        mznIcon
                        [icon]="isPinned(record) ? pinFilledIcon : pinIcon"
                        [color]="isPinned(record) ? 'brand' : 'neutral'"
                      ></i>
                    </button>
                  }
                </td>
              }
              @if (hasSelection()) {
                <td
                  [class]="bodySelectionCellClass()"
                  [style]="selectionCellStyle()"
                >
                  <div [class]="selectionCheckboxClass">
                    @if (loading()) {
                      <span
                        mznSkeleton
                        width="100%"
                        variant="body-highlight"
                      ></span>
                    } @else if (selectionMode() === 'radio') {
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
              @for (col of columns(); track col.key; let colIndex = $index) {
                <td
                  [class]="cellClassesMap().get(col.key) ?? ''"
                  [class.mzn-table__cell--highlight]="
                    isCellHighlighted(idx, colIndex)
                  "
                  [attr.data-column-key]="col.key"
                  [style]="fixedOffsetStyleMap().get(col.key) ?? {}"
                  (mouseenter)="onCellMouseEnter(idx, colIndex)"
                >
                  <div style="display: grid; width: 100%;">
                    <div [class]="cellContentClassesMap().get(col.key) ?? ''">
                      @if (loading()) {
                        <span
                          mznSkeleton
                          width="100%"
                          variant="body-highlight"
                        ></span>
                      } @else if (cellRenderMap().get(col.key); as cellTpl) {
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
              @if (toggleable()?.enabled) {
                <td
                  [class]="toggleableCellClass()"
                  [style]="toggleableCellStyle()"
                >
                  @if (loading()) {
                    <span
                      mznSkeleton
                      width="100%"
                      variant="body-highlight"
                    ></span>
                  } @else {
                    <div
                      mznToggle
                      [checked]="isToggled(record)"
                      [disabled]="isToggleDisabled(record)"
                      size="sub"
                      (click)="onToggleClick(record, $event)"
                    ></div>
                  }
                </td>
              }
              @if (collectable()?.enabled) {
                <td
                  [class]="collectableCellClass()"
                  [style]="collectableCellStyle()"
                >
                  @if (loading()) {
                    <span
                      mznSkeleton
                      width="100%"
                      variant="body-highlight"
                    ></span>
                  } @else {
                    <button
                      type="button"
                      [class]="getCollectButtonClass(record)"
                      [attr.aria-disabled]="isCollectDisabled(record)"
                      [attr.aria-label]="
                        isCollected(record)
                          ? 'Remove from collection'
                          : 'Add to collection'
                      "
                      [attr.aria-pressed]="isCollected(record)"
                      [disabled]="isCollectDisabled(record)"
                      (click)="onCollectClick(record); $event.stopPropagation()"
                    >
                      <i
                        mznIcon
                        [icon]="
                          isCollected(record) ? starFilledIcon : starOutlineIcon
                        "
                        [color]="isCollected(record) ? 'brand' : 'neutral'"
                      ></i>
                    </button>
                  }
                </td>
              }
              @if (actions(); as act) {
                <td
                  [class]="getActionsBodyCellClasses(act)"
                  [style]="getActionsFixedOffsetStyle(act)"
                >
                  <div [class]="getActionsCellContentClasses(act)">
                    <div [class]="actionsCellClass">
                      @if (loading()) {
                        <span
                          mznSkeleton
                          width="100%"
                          variant="body-highlight"
                        ></span>
                      } @else {
                        @for (
                          action of act.render(record, idx);
                          track action.key
                        ) {
                          @if (asDropdownAction(action); as dropAction) {
                            <!-- Dropdown action trigger mirrors React TableActionsCell (iconType icon-only; default variant base-text-link, NOT inheriting actions.variant; icon fallback to DotHorizontalIcon). -->
                            <button
                              #rowActionDropdownAnchor
                              mznButton
                              type="button"
                              size="sub"
                              iconType="icon-only"
                              [variant]="dropAction.variant ?? 'base-text-link'"
                              [disabled]="dropAction.disabled ?? false"
                              (click)="
                                onRowActionDropdownToggle(idx, dropAction.key);
                                $event.stopPropagation()
                              "
                            >
                              <i
                                mznIcon
                                [icon]="dropAction.icon ?? dotHorizontalIcon"
                                [size]="16"
                              ></i>
                            </button>
                            <!--
                              Portal the dropdown to the global layer so its
                              popper escapes the overlayscrollbars viewport
                              (contain: strict) and sticky-cell stacking
                              contexts that would otherwise clip or cover it.
                            -->
                            <div mznPortal>
                              <div
                                mznDropdown
                                [anchor]="rowActionDropdownAnchor"
                                [open]="
                                  rowActionDropdownOpenKey() ===
                                  rowActionDropdownKey(idx, dropAction.key)
                                "
                                [options]="dropAction.options"
                                [placement]="
                                  dropAction.placement ?? 'bottom-end'
                                "
                                (selected)="
                                  onRowActionDropdownSelect(
                                    dropAction,
                                    record,
                                    idx,
                                    $event
                                  )
                                "
                                (closed)="rowActionDropdownOpenKey.set(null)"
                              ></div>
                            </div>
                          } @else if (asButtonAction(action); as btnAction) {
                            <button
                              mznButton
                              type="button"
                              size="sub"
                              iconType="leading"
                              [variant]="resolveActionVariant(btnAction, act)"
                              [disabled]="btnAction.disabled ?? false"
                              (click)="
                                btnAction.onClick?.(record, idx);
                                $event.stopPropagation()
                              "
                            >
                              @if (btnAction.icon) {
                                <i
                                  mznIcon
                                  [icon]="btnAction.icon"
                                  [size]="16"
                                ></i>
                              }
                              {{ btnAction.label }}
                            </button>
                          }
                        }
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
                  [style.padding-left.px]="expansionLeftPadding()"
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
    @if (pagination(); as pg) {
      <div #paginationHost [class]="paginationWrapperClass">
        <nav
          mznPagination
          [current]="pg.current ?? 1"
          [pageSize]="pg.pageSize ?? 10"
          [total]="pg.total"
          [disabled]="pg.disabled ?? false"
          [showPageSizeOptions]="pg.showPageSizeOptions ?? false"
          [pageSizeLabel]="pg.pageSizeLabel"
          [pageSizeOptions]="pg.pageSizeOptions"
          [renderResultSummary]="pg.renderResultSummary"
          [showJumper]="pg.showJumper ?? false"
          [inputPlaceholder]="pg.inputPlaceholder"
          [hintText]="pg.hintText"
          [buttonText]="pg.buttonText"
          (pageChanged)="onPaginationChange($event)"
          (pageSizeChanged)="pg.onPageSizeChange?.($event)"
        ></nav>
      </div>
    }

    <!-- Bulk actions bar (mirrors React <TableBulkActions>) -->
    @if (bulkActionsConfig(); as cfg) {
      @if (resolvedSelectedKeys().size > 0) {
        <div
          [class]="bulkActionsClass"
          [class.mzn-table__bulk-actions--fixed]="isBulkActionsFixed()"
        >
          <div [class]="bulkActionsSummaryClass">
            <button
              mznButton
              type="button"
              size="sub"
              variant="inverse"
              iconType="trailing"
              (click)="onBulkClearSelection(cfg)"
            >
              {{ getBulkSummaryLabel(cfg) }}
              <i mznIcon [icon]="closeIcon" [size]="16"></i>
            </button>
          </div>
          <div [class]="bulkActionsActionAreaClass">
            @for (
              action of cfg.mainActions;
              track action.label;
              let i = $index
            ) {
              <button
                mznButton
                type="button"
                size="sub"
                variant="inverse-ghost"
                iconType="leading"
                (click)="onBulkMainAction(action)"
              >
                @if (action.icon) {
                  <i mznIcon [icon]="action.icon" [size]="16"></i>
                }
                {{ action.label }}
              </button>
            }
            @if (cfg.destructiveAction; as da) {
              <div [class]="bulkActionsSeparatorClass"></div>
              <button
                mznButton
                type="button"
                size="sub"
                variant="destructive-ghost"
                iconType="leading"
                (click)="onBulkMainAction(da)"
              >
                @if (da.icon) {
                  <i mznIcon [icon]="da.icon" [size]="16"></i>
                }
                {{ da.label }}
              </button>
            }
            @if (cfg.overflowAction; as oa) {
              <div [class]="bulkActionsSeparatorClass"></div>
              <button
                #bulkOverflowAnchor
                mznButton
                type="button"
                size="sub"
                variant="inverse-ghost"
                iconType="leading"
                (click)="bulkOverflowOpen.set(!bulkOverflowOpen())"
              >
                @if (oa.icon) {
                  <i mznIcon [icon]="oa.icon" [size]="16"></i>
                }
                {{ oa.label }}
              </button>
              <div
                mznDropdown
                [anchor]="bulkOverflowAnchor"
                [open]="bulkOverflowOpen()"
                [options]="oa.options"
                [placement]="oa.placement ?? 'top'"
                (selected)="onBulkOverflowSelect(oa, $event)"
                (closed)="bulkOverflowOpen.set(false)"
              ></div>
            }
          </div>
        </div>
      }
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

  /**
   * Left padding for the expanded-row cell so the expanded content aligns
   * with the first data column. Mirrors React `useTableExpansion`'s
   * `expansionLeftPadding` (DRAG_OR_PIN_HANDLE_COLUMN_WIDTH +
   * EXPANSION_COLUMN_WIDTH), excluding the selection column which React
   * renders after the expand column.
   */
  protected readonly expansionLeftPadding = computed((): number => {
    let padding = 0;

    if (this.isDragEnabled() || this.isPinEnabled()) padding += 40;
    if (this.isExpandableEnabled()) padding += 40;

    return padding;
  });

  /**
   * Resolve a column's rendered width in px for fixed-offset accumulation.
   * Prefers the resized override (via `resolvedColumnWidths`), then the
   * explicit `column.width`, then `minWidth`, and finally a conservative 0.
   */
  private getColumnRenderedWidth(col: TableColumn): number {
    const resolved = this.resolvedColumnWidths().get(col.key);

    if (resolved != null) return resolved;

    if (typeof col.width === 'number') return col.width;
    if (typeof col.width === 'string') {
      const parsed = parseFloat(col.width);

      if (Number.isFinite(parsed)) return parsed;
    }
    if (typeof col.minWidth === 'number') return col.minWidth;

    return 0;
  }

  /**
   * Whether each action column is configured with `fixed: true`. Mirrors
   * React `actionConfig.{expansion,dragOrPinHandle,selection,toggleable,
   * collectable}Fixed` flags used in `useTableFixedOffsets`.
   */
  protected readonly isExpandFixed = computed(
    (): boolean =>
      this.isExpandableEnabled() &&
      typeof this.expandable() === 'object' &&
      !!(this.expandable() as TableExpandable).fixed,
  );

  protected readonly isDragOrPinFixed = computed((): boolean => {
    // `TableDraggable` in Angular has no `fixed` field — draggable columns
    // are never sticky. Only `TablePinnable.fixed` participates.
    if (this.isPinEnabled()) return !!this.pinnable()?.fixed;

    return false;
  });

  protected readonly isSelectionFixed = computed((): boolean => {
    const rs = this.rowSelection();

    return this.hasSelection() && typeof rs === 'object' && !!rs.fixed;
  });

  protected readonly isToggleableFixed = computed(
    (): boolean => !!this.toggleable()?.enabled && !!this.toggleable()?.fixed,
  );

  protected readonly isCollectableFixed = computed(
    (): boolean => !!this.collectable()?.enabled && !!this.collectable()?.fixed,
  );

  /**
   * Per-action-column offsets (px) for start / end sticky positioning.
   * Mirrors React `useTableFixedOffsets.fixedOffsets` — accumulates in
   * DOM order (Expand → Drag/Pin → Selection on the left; Collectable →
   * Toggleable → Actions on the right, read right-to-left).
   */
  protected readonly expandFixedOffset = computed((): number => 0);

  protected readonly dragFixedOffset = computed((): number =>
    this.isExpandFixed() ? DRAG_OR_PIN_HANDLE_COLUMN_WIDTH : 0,
  );

  protected readonly selectionFixedOffset = computed((): number => {
    let acc = 0;

    if (this.isExpandFixed()) acc += EXPANSION_COLUMN_WIDTH;
    if (this.isDragOrPinFixed()) acc += DRAG_OR_PIN_HANDLE_COLUMN_WIDTH;

    return acc;
  });

  /** Total width of fixed-start action columns (sits before data columns). */
  private readonly fixedStartLeadingWidth = computed((): number => {
    let acc = 0;

    if (this.isExpandFixed()) acc += EXPANSION_COLUMN_WIDTH;
    if (this.isDragOrPinFixed()) acc += DRAG_OR_PIN_HANDLE_COLUMN_WIDTH;
    if (this.isSelectionFixed()) acc += SELECTION_COLUMN_WIDTH;

    return acc;
  });

  /** Actions width when `actions.fixed === 'end'`, else 0. */
  private readonly fixedActionsWidth = computed((): number => {
    const act = this.actions();

    if (act?.fixed !== 'end') return 0;

    return typeof act.width === 'number'
      ? act.width
      : typeof act.width === 'string'
        ? parseFloat(act.width) || 0
        : (act.minWidth ?? 0);
  });

  /**
   * Right-side offsets accumulate right-to-left over the actual DOM
   * order, which mirrors React `Table.tsx:177-226`:
   *   data columns → Toggleable → Collectable → Actions
   * So Actions sits at the right edge (offset 0 when fixed); Collectable
   * is one step inward (skips Actions if fixed); Toggleable is two steps
   * inward (skips Collectable + Actions if those are fixed).
   */
  protected readonly collectableFixedOffset = computed((): number =>
    this.fixedActionsWidth(),
  );

  protected readonly toggleableFixedOffset = computed((): number => {
    let acc = this.fixedActionsWidth();
    const c = this.collectable();

    if (this.isCollectableFixed())
      acc += c?.minWidth ?? COLLECTABLE_COLUMN_WIDTH;

    return acc;
  });

  /**
   * Map of column key → cumulative left offset (px) for `fixed: 'start'`
   * data columns. Mirrors React `useTableFixedOffsets.startOffsets` —
   * accumulates starting from the leading action columns' widths
   * (`fixedStartLeadingWidth`) so a `column.fixed: 'start'` sits right
   * after any fixed expand/drag/selection columns.
   */
  protected readonly fixedStartOffsets = computed(
    (): ReadonlyMap<string, number> => {
      const map = new Map<string, number>();
      let acc = this.fixedStartLeadingWidth();

      for (const col of this.columns()) {
        if (col.fixed === 'start') {
          map.set(col.key, acc);
          acc += this.getColumnRenderedWidth(col);
        }
      }

      return map;
    },
  );

  /* ---------------------------------------------------------------- */
  /*  Sticky-column shadow (mirrors React useTableFixedOffsets)        */
  /* ---------------------------------------------------------------- */

  /**
   * Natural left-edge position (px) of every column in DOM order —
   * Expand, Drag/Pin, Selection, data columns, Toggleable, Collectable,
   * Actions. Mirrors React `useTableFixedOffsets.originalPositions`.
   */
  private readonly columnOriginalPositions = computed(
    (): ReadonlyMap<string, number> => {
      const map = new Map<string, number>();
      let pos = 0;

      if (this.isExpandableEnabled()) {
        map.set(EXPANSION_KEY, pos);
        pos += EXPANSION_COLUMN_WIDTH;
      }

      if (this.isDragEnabled() || this.isPinEnabled()) {
        map.set(DRAG_OR_PIN_HANDLE_KEY, pos);
        pos += DRAG_OR_PIN_HANDLE_COLUMN_WIDTH;
      }

      if (this.hasSelection()) {
        map.set(SELECTION_KEY, pos);
        pos += SELECTION_COLUMN_WIDTH;
      }

      for (const col of this.columns()) {
        map.set(col.key, pos);
        pos += this.getColumnRenderedWidth(col);
      }

      if (this.toggleable()?.enabled) {
        map.set(TOGGLEABLE_KEY, pos);
        pos += this.toggleable()?.minWidth ?? TOGGLEABLE_COLUMN_WIDTH;
      }

      if (this.collectable()?.enabled) {
        map.set(COLLECTABLE_KEY, pos);
        pos += this.collectable()?.minWidth ?? COLLECTABLE_COLUMN_WIDTH;
      }

      const act = this.actions();

      if (act) {
        map.set(TABLE_ACTIONS_KEY, pos);
      }

      return map;
    },
  );

  /** Natural rendered width (px) of a column key, using the same lookups
   *  as `columnOriginalPositions`. */
  private getColumnWidthByKey(key: string): number {
    if (key === EXPANSION_KEY) return EXPANSION_COLUMN_WIDTH;
    if (key === DRAG_OR_PIN_HANDLE_KEY) return DRAG_OR_PIN_HANDLE_COLUMN_WIDTH;
    if (key === SELECTION_KEY) return SELECTION_COLUMN_WIDTH;

    if (key === TOGGLEABLE_KEY) {
      return this.toggleable()?.minWidth ?? TOGGLEABLE_COLUMN_WIDTH;
    }

    if (key === COLLECTABLE_KEY) {
      return this.collectable()?.minWidth ?? COLLECTABLE_COLUMN_WIDTH;
    }

    if (key === TABLE_ACTIONS_KEY) {
      const act = this.actions();

      if (!act) return 0;

      return typeof act.width === 'number'
        ? act.width
        : typeof act.width === 'string'
          ? parseFloat(act.width) || 0
          : (act.minWidth ?? 0);
    }

    const col = this.columns().find((c) => c.key === key);

    return col ? this.getColumnRenderedWidth(col) : 0;
  }

  /**
   * Ordered list of column keys that are `fixed: 'start'`, in DOM order
   * (left-to-right). Mirrors React `useTableFixedOffsets.fixedStartKeys`.
   */
  private readonly fixedStartKeyList = computed((): readonly string[] => {
    const keys: string[] = [];

    if (this.isExpandFixed()) keys.push(EXPANSION_KEY);
    if (this.isDragOrPinFixed()) keys.push(DRAG_OR_PIN_HANDLE_KEY);
    if (this.isSelectionFixed()) keys.push(SELECTION_KEY);

    for (const col of this.columns()) {
      if (col.fixed === 'start') keys.push(col.key);
    }

    return keys;
  });

  /**
   * Ordered list of column keys that are `fixed: 'end'`, in DOM order
   * (left-to-right). Mirrors React `useTableFixedOffsets.fixedEndKeys`.
   */
  private readonly fixedEndKeyList = computed((): readonly string[] => {
    const keys: string[] = [];

    for (const col of this.columns()) {
      if (col.fixed === 'end') keys.push(col.key);
    }

    if (this.isToggleableFixed()) keys.push(TOGGLEABLE_KEY);
    if (this.isCollectableFixed()) keys.push(COLLECTABLE_KEY);
    if (this.actions()?.fixed === 'end') keys.push(TABLE_ACTIONS_KEY);

    return keys;
  });

  /** Cumulative right-edge offset (px) for every `fixed: 'end'` key. */
  private readonly fixedEndOffsetMap = computed(
    (): ReadonlyMap<string, number> => {
      const keys = this.fixedEndKeyList();
      const map = new Map<string, number>();
      let acc = 0;

      for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];

        map.set(key, acc);
        acc += this.getColumnWidthByKey(key);
      }

      return map;
    },
  );

  /** Cumulative left-edge offset (px) for every `fixed: 'start'` key —
   *  including the synthetic action keys. */
  private readonly fixedStartOffsetMap = computed(
    (): ReadonlyMap<string, number> => {
      const keys = this.fixedStartKeyList();
      const map = new Map<string, number>();
      let acc = 0;

      for (const key of keys) {
        map.set(key, acc);
        acc += this.getColumnWidthByKey(key);
      }

      return map;
    },
  );

  /**
   * Per-key shadow flag. A fixed column shows its shadow only while it's
   * currently covering a non-sticky neighbour. Mirrors React
   * `useTableFixedOffsets.shouldShowShadow` exactly (left/right branches).
   */
  protected readonly shadowMap = computed((): ReadonlyMap<string, boolean> => {
    const map = new Map<string, boolean>();
    const scrollLeft = this.scrollLeft();
    const containerWidth = this.containerWidth();
    const starts = this.fixedStartKeyList();
    const ends = this.fixedEndKeyList();
    const startOffsets = this.fixedStartOffsetMap();
    const endOffsets = this.fixedEndOffsetMap();
    const positions = this.columnOriginalPositions();

    for (let i = 0; i < starts.length; i++) {
      const key = starts[i];
      const offset = startOffsets.get(key) ?? 0;
      const originalPos = positions.get(key) ?? 0;
      const isSticky = scrollLeft > originalPos - offset;

      if (!isSticky) {
        map.set(key, false);
        continue;
      }

      const nextIndex = i + 1;

      if (nextIndex < starts.length) {
        const nextKey = starts[nextIndex];
        const nextOriginalPos = positions.get(nextKey) ?? 0;
        const nextOffset = startOffsets.get(nextKey) ?? 0;
        const isNextSticky = scrollLeft >= nextOriginalPos - nextOffset;

        map.set(key, !isNextSticky);
      } else {
        map.set(key, true);
      }
    }

    for (let i = 0; i < ends.length; i++) {
      const key = ends[i];
      const offset = endOffsets.get(key) ?? 0;
      const originalPos = positions.get(key) ?? 0;
      const colWidth = this.getColumnWidthByKey(key);
      const isSticky =
        scrollLeft + containerWidth < originalPos + colWidth + offset;

      if (!isSticky) {
        map.set(key, false);
        continue;
      }

      const prevIndex = i - 1;

      if (prevIndex >= 0) {
        const prevKey = ends[prevIndex];
        const prevOriginalPos = positions.get(prevKey) ?? 0;
        const prevOffset = endOffsets.get(prevKey) ?? 0;
        const prevColWidth = this.getColumnWidthByKey(prevKey);
        const isPrevSticky =
          scrollLeft + containerWidth <
          prevOriginalPos + prevColWidth + prevOffset;

        map.set(key, !isPrevSticky);
      } else {
        map.set(key, true);
      }
    }

    return map;
  });

  /**
   * Map of column key → cumulative right offset (px) for `fixed: 'end'`
   * columns. Mirrors React `useTableFixedOffsets.endOffsets` — iterates
   * end-fixed columns *right-to-left*, so the rightmost column has
   * offset 0 and earlier end-fixed columns accumulate the sum of widths
   * to their right.
   *
   * The actions column is treated as the rightmost end-fixed entry when
   * `actions.fixed === 'end'`.
   */
  protected readonly fixedEndOffsets = computed(
    (): ReadonlyMap<string, number> => {
      const map = new Map<string, number>();
      let acc = 0;
      const act = this.actions();

      if (act?.fixed === 'end') {
        map.set(TABLE_ACTIONS_KEY, acc);
        const w =
          typeof act.width === 'number'
            ? act.width
            : typeof act.width === 'string'
              ? parseFloat(act.width) || 0
              : (act.minWidth ?? 0);

        acc += w;
      }

      const cols = this.columns();

      for (let i = cols.length - 1; i >= 0; i--) {
        const col = cols[i];

        if (col.fixed === 'end') {
          map.set(col.key, acc);
          acc += this.getColumnRenderedWidth(col);
        }
      }

      return map;
    },
  );

  /**
   * Offset (px) for the actions column when `actions.fixed === 'end'`.
   * Convenience accessor used by template `<td>`/`<th>` of the actions cell.
   */
  protected readonly actionsFixedEndOffset = computed((): number => {
    const act = this.actions();

    if (act?.fixed !== 'end') return 0;

    return this.fixedEndOffsets().get(TABLE_ACTIONS_KEY) ?? 0;
  });

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

    // Track pagination element height and write it to a CSS variable on the
    // table host (`--mzn-table-pagination-height`) so the bulk-actions
    // fixed-bottom math can subtract it. Mirrors React `Table.tsx`'s
    // `paginationRef` ResizeObserver.
    afterNextRender(() => {
      const paginationEl = this.paginationHostRef()?.nativeElement;

      if (!paginationEl) return;

      const apply = (): void => {
        this.hostEl.nativeElement.style.setProperty(
          '--mzn-table-pagination-height',
          `${paginationEl.offsetHeight}px`,
        );
      };

      apply();
      const ro = new ResizeObserver(apply);

      ro.observe(paginationEl);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });

    // Bulk-actions fixed-position state.
    // Mirrors React `Table.tsx` `isBulkActionsFixed` effect:
    //   shouldBeFixed =
    //     hostRect.bottom > viewportHeight + paginationHeight
    //     && hostRect.top < viewportHeight - bottomSpacing
    //   (pin to the viewport bottom while the table is crossing it)
    //
    // Recalculates on scroll / resize, throttled to 50ms, plus an initial
    // pass. Also sets `--mzn-bulk-actions-fixed-left` when fixed so the
    // bar centers on the table even when the table isn't horizontally
    // centered in the viewport.
    afterNextRender(() => {
      const apply = (): void => this.calculateBulkActionsFixed();

      apply();

      const throttled = throttleRaf(apply, 50);

      window.addEventListener('scroll', throttled.run, { passive: true });
      window.addEventListener('resize', throttled.run);

      this.destroyRef.onDestroy(() => {
        throttled.cancel();
        window.removeEventListener('scroll', throttled.run);
        window.removeEventListener('resize', throttled.run);
      });
    });

    // Recompute on signal-driven state changes that affect the bar's
    // visibility or position (selection count, rowSelection config,
    // pagination layout). Scroll/resize listeners only catch viewport
    // changes; this effect catches *data* changes.
    effect(() => {
      // Read signals so the effect tracks them.
      this.resolvedSelectedKeys();
      this.bulkActionsConfig();

      queueMicrotask(() => this.calculateBulkActionsFixed());
    });
  }

  /**
   * Compute `isBulkActionsFixed` and (when fixed) publish the table's
   * horizontal center as `--mzn-bulk-actions-fixed-left`. React's
   * identical logic lives in `Table.tsx` `calculateFixedState`.
   */
  private calculateBulkActionsFixed(): void {
    if (!this.bulkActionsConfig() || this.resolvedSelectedKeys().size === 0) {
      this.isBulkActionsFixed.set(false);

      return;
    }

    const hostEl = this.hostEl.nativeElement;
    const rect = hostEl.getBoundingClientRect();
    const hostStyle = window.getComputedStyle(hostEl);
    const paginationHeight =
      parsePxVar(hostStyle.getPropertyValue('--mzn-table-pagination-height')) ??
      0;
    const bottomSpacing =
      parsePxVar(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--mzn-spacing-padding-vertical-relaxed'),
      ) ?? 0;

    const viewportHeight = window.innerHeight;
    const bulkActionsFixedBottom = viewportHeight - bottomSpacing;
    const shouldBeFixed =
      rect.bottom > viewportHeight + paginationHeight &&
      rect.top < bulkActionsFixedBottom;

    this.isBulkActionsFixed.set(shouldBeFixed);

    if (shouldBeFixed) {
      const centerLeft = rect.left + rect.width / 2;

      hostEl.style.setProperty(
        '--mzn-bulk-actions-fixed-left',
        `${centerLeft}px`,
      );
    }
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

  /**
   * Cached reference to `MznScrollbar`'s OverlayScrollbars viewport —
   * the actual scrollable element. Needed because CDK's built-in
   * `_startScrollingIfNecessary` walks ancestors for `overflow:
   * auto|scroll`, but OverlayScrollbars wraps the real scroll layer
   * behind `overflow: hidden`, so CDK can't discover it. We use this
   * ref in `onDragMoved` to auto-scroll when the pointer nears the
   * edge — mirroring `@hello-pangea/dnd`'s built-in auto-scroller.
   */
  private scrollViewport: HTMLElement | null = null;

  /**
   * Live horizontal scroll position of the table's scroll container.
   * Needed by the sticky-column shadow logic (mirrors React
   * `useTableSuperContext().scrollLeft`): a fixed-start column only
   * shows its shadow once `scrollLeft` has moved it past the next
   * column's natural position.
   */
  private readonly scrollLeft = signal(0);

  private scrollCleanup: (() => void) | null = null;

  protected onScrollViewportReady(event: { viewport: HTMLElement }): void {
    this.scrollViewport = event.viewport;

    this.scrollCleanup?.();

    this.scrollLeft.set(event.viewport.scrollLeft);

    const handler = (): void => {
      this.scrollLeft.set(event.viewport.scrollLeft);
    };

    this.ngZone.runOutsideAngular(() => {
      event.viewport.addEventListener('scroll', handler, { passive: true });
    });

    this.scrollCleanup = (): void => {
      event.viewport.removeEventListener('scroll', handler);
    };

    this.destroyRef.onDestroy(() => {
      this.scrollCleanup?.();
      this.scrollCleanup = null;
    });
  }

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

  private readonly ngZone = inject(NgZone);

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
  protected readonly headerCellIconClass = tableClasses.headerCellIcon;
  protected readonly bodyClass = tableClasses.body;
  protected readonly cellContentClass = tableClasses.cellContent;
  protected readonly selectionCellClass = tableClasses.selectionCell;
  protected readonly selectionCheckboxClass = tableClasses.selectionCheckbox;
  protected readonly expandCellClass = tableClasses.expandCell;

  /**
   * Sticky-aware class + style computeds for the selection / expand /
   * drag-or-pin / toggleable / collectable action columns. Each reads
   * its own `isXxxFixed` + `xxxFixedOffset` signal so the cells pick
   * up `mzn-table__cell--fixed --fixed-start/--fixed-end` plus
   * `--fixed-start-offset` / `--fixed-end-offset` CSS variables, same
   * as React's `TableSelectionCell` / `TableExpandCell` etc.
   */
  protected readonly bodySelectionCellClass = computed((): string =>
    clsx(tableClasses.cell, tableClasses.selectionCell, {
      [tableClasses.cellFixed]: this.isSelectionFixed(),
      [tableClasses.cellFixedStart]: this.isSelectionFixed(),
      [tableClasses.cellFixedShadow]:
        this.isSelectionFixed() && !!this.shadowMap().get(SELECTION_KEY),
    }),
  );

  protected readonly headerSelectionCellClass = computed((): string =>
    clsx(tableClasses.headerCell, tableClasses.selectionCell, {
      [tableClasses.cellFixed]: this.isSelectionFixed(),
      [tableClasses.cellFixedStart]: this.isSelectionFixed(),
      [tableClasses.cellFixedShadow]:
        this.isSelectionFixed() && !!this.shadowMap().get(SELECTION_KEY),
      [tableClasses.headerCellFixed]: this.isSelectionFixed(),
    }),
  );

  protected readonly selectionCellStyle = computed(
    (): Record<string, string> =>
      this.isSelectionFixed()
        ? { '--fixed-start-offset': `${this.selectionFixedOffset()}px` }
        : {},
  );

  protected readonly bodyExpandCellClass = computed((): string =>
    clsx(tableClasses.cell, tableClasses.expandCell, {
      [tableClasses.cellFixed]: this.isExpandFixed(),
      [tableClasses.cellFixedStart]: this.isExpandFixed(),
      [tableClasses.cellFixedShadow]:
        this.isExpandFixed() && !!this.shadowMap().get(EXPANSION_KEY),
    }),
  );

  protected readonly headerExpandCellClass = computed((): string =>
    clsx(tableClasses.headerCell, tableClasses.expandCell, {
      [tableClasses.cellFixed]: this.isExpandFixed(),
      [tableClasses.cellFixedStart]: this.isExpandFixed(),
      [tableClasses.cellFixedShadow]:
        this.isExpandFixed() && !!this.shadowMap().get(EXPANSION_KEY),
      [tableClasses.headerCellFixed]: this.isExpandFixed(),
    }),
  );

  protected readonly expandCellStyle = computed(
    (): Record<string, string> =>
      this.isExpandFixed()
        ? { '--fixed-start-offset': `${this.expandFixedOffset()}px` }
        : {},
  );

  protected readonly dragOrPinCellClass = computed((): string =>
    clsx(tableClasses.dragOrPinHandleCell, {
      [tableClasses.cellFixed]: this.isDragOrPinFixed(),
      [tableClasses.cellFixedStart]: this.isDragOrPinFixed(),
      [tableClasses.cellFixedShadow]:
        this.isDragOrPinFixed() &&
        !!this.shadowMap().get(DRAG_OR_PIN_HANDLE_KEY),
    }),
  );

  protected readonly dragOrPinCellStyle = computed(
    (): Record<string, string> =>
      this.isDragOrPinFixed()
        ? { '--fixed-start-offset': `${this.dragFixedOffset()}px` }
        : {},
  );

  protected readonly toggleableCellClass = computed((): string =>
    clsx(tableClasses.cell, {
      [tableClasses.cellFixed]: this.isToggleableFixed(),
      [tableClasses.cellFixedEnd]: this.isToggleableFixed(),
      [tableClasses.cellFixedShadow]:
        this.isToggleableFixed() && !!this.shadowMap().get(TOGGLEABLE_KEY),
    }),
  );

  protected readonly toggleableHeaderClass = computed((): string =>
    clsx(tableClasses.headerCell, {
      [tableClasses.cellFixed]: this.isToggleableFixed(),
      [tableClasses.cellFixedEnd]: this.isToggleableFixed(),
      [tableClasses.cellFixedShadow]:
        this.isToggleableFixed() && !!this.shadowMap().get(TOGGLEABLE_KEY),
      [tableClasses.headerCellFixed]: this.isToggleableFixed(),
    }),
  );

  protected readonly toggleableCellStyle = computed(
    (): Record<string, string> =>
      this.isToggleableFixed()
        ? { '--fixed-end-offset': `${this.toggleableFixedOffset()}px` }
        : {},
  );

  protected readonly collectableCellClass = computed((): string =>
    clsx(tableClasses.cell, {
      [tableClasses.cellFixed]: this.isCollectableFixed(),
      [tableClasses.cellFixedEnd]: this.isCollectableFixed(),
      [tableClasses.cellFixedShadow]:
        this.isCollectableFixed() && !!this.shadowMap().get(COLLECTABLE_KEY),
    }),
  );

  protected readonly collectableHeaderClass = computed((): string =>
    clsx(tableClasses.headerCell, {
      [tableClasses.cellFixed]: this.isCollectableFixed(),
      [tableClasses.cellFixedEnd]: this.isCollectableFixed(),
      [tableClasses.cellFixedShadow]:
        this.isCollectableFixed() && !!this.shadowMap().get(COLLECTABLE_KEY),
      [tableClasses.headerCellFixed]: this.isCollectableFixed(),
    }),
  );

  protected readonly collectableCellStyle = computed(
    (): Record<string, string> =>
      this.isCollectableFixed()
        ? { '--fixed-end-offset': `${this.collectableFixedOffset()}px` }
        : {},
  );
  protected readonly expandedRowClass = tableClasses.expandedRow;
  protected readonly expandedRowCellClass = tableClasses.expandedRowCell;
  protected readonly expandedContentClass = tableClasses.expandedContent;
  protected readonly collectHandleIconClass = tableClasses.collectHandleIcon;

  /**
   * Mirrors React `cx(classes.collectHandleIcon, { [`${…}--disabled`]: isDisabled })`
   * in `TableCollectableCell.tsx` — appends a BEM `--disabled` modifier
   * so the core SCSS (`_table-styles.scss:485-497`) can apply the
   * disabled cursor + opacity.
   */
  protected getCollectButtonClass(record: TableDataSource): string {
    return clsx(tableClasses.collectHandleIcon, {
      [`${tableClasses.collectHandleIcon}--disabled`]:
        this.isCollectDisabled(record),
    });
  }
  protected readonly dragOrPinHandleClass = tableClasses.dragOrPinHandle;
  /**
   * Classes applied to CDK's drag preview clone so the dragging row picks up
   * `mzn-table__body__row--dragging` styles (drop-shadow, `display: flex`,
   * border-bottom) — mirrors React `TableRow` composing `classes.bodyRowDragging`
   * when `snapshot.isDragging` is true. Also reapplies `bodyRow` because the
   * cdk-preview clone may lose tbody cascade and needs surface background.
   */
  protected readonly dragPreviewClassNames = [
    tableClasses.bodyRow,
    tableClasses.bodyRowDragging,
  ];
  protected readonly emptyClass = tableClasses.empty;
  /** Pagination wrapper class — not in core, defined locally. */
  protected readonly paginationWrapperClass = `${tableClasses.root}__pagination`;

  // Bulk actions bar classes (mirror React `TableBulkActions`).
  protected readonly bulkActionsClass = tableClasses.bulkActions;
  protected readonly bulkActionsSummaryClass =
    tableClasses.bulkActionsSelectionSummary;
  protected readonly bulkActionsActionAreaClass =
    tableClasses.bulkActionsActionArea;
  protected readonly bulkActionsSeparatorClass =
    tableClasses.bulkActionsSeparator;
  protected readonly closeIcon = CloseIcon;

  /** Overflow dropdown open state for the bulk actions bar. */
  protected readonly bulkOverflowOpen = signal(false);

  /**
   * Single-open state for per-row dropdown actions. Stores a composite
   * key `${rowIndex}::${actionKey}` so only one row's dropdown is open
   * at a time, matching the typical UX of inline action dropdowns.
   */
  protected readonly rowActionDropdownOpenKey = signal<string | null>(null);

  protected rowActionDropdownKey(rowIndex: number, actionKey: string): string {
    return `${rowIndex}::${actionKey}`;
  }

  protected onRowActionDropdownToggle(
    rowIndex: number,
    actionKey: string,
  ): void {
    const key = this.rowActionDropdownKey(rowIndex, actionKey);
    const current = this.rowActionDropdownOpenKey();

    this.rowActionDropdownOpenKey.set(current === key ? null : key);
  }

  protected onRowActionDropdownSelect(
    action: TableActionDropdownItem,
    record: TableDataSource,
    rowIndex: number,
    option: DropdownOption,
  ): void {
    action.onSelect(option, record, rowIndex);
    this.rowActionDropdownOpenKey.set(null);
  }

  /**
   * Whether the bulk actions bar should pin to the bottom of the viewport.
   * Mirrors React `Table.tsx`'s `isBulkActionsFixed` state — true when the
   * table's top is above the bar's fixed slot AND its bottom is below the
   * viewport (minus pagination height), meaning the user hasn't scrolled
   * past the table.
   */
  protected readonly isBulkActionsFixed = signal(false);

  /**
   * `<div class="mzn-table__pagination">` element ref — used to read
   * `offsetHeight` into the `--mzn-table-pagination-height` CSS variable
   * so `calculateBulkActionsFixed` can offset for the pagination bar (see
   * React `Table.tsx` `paginationRef` ResizeObserver).
   */
  private readonly paginationHostRef =
    viewChild<ElementRef<HTMLElement>>('paginationHost');

  /**
   * Bulk actions configuration — returns the `bulkActions` object only when
   * the current `rowSelection` is checkbox mode with `bulkActions` defined.
   */
  protected readonly bulkActionsConfig = computed(
    (): TableBulkActions | null => {
      const rs = this.rowSelection();

      if (
        typeof rs === 'object' &&
        rs !== null &&
        'mode' in rs &&
        rs.mode === 'checkbox'
      ) {
        return rs.bulkActions ?? null;
      }

      return null;
    },
  );

  /** Resolve row objects for keys currently in `selectedRowKeys`. */
  private selectedRowsFromKeys(): readonly TableDataSource[] {
    const selected = this.resolvedSelectedKeys();

    return this.dataSource().filter((r) => selected.has(getRowKey(r)));
  }

  /** Summary label for the bulk actions bar. */
  protected getBulkSummaryLabel(cfg: TableBulkActions): string {
    const keys = [...this.resolvedSelectedKeys()];
    const rows = this.selectedRowsFromKeys();

    if (cfg.renderSelectionSummary) {
      return cfg.renderSelectionSummary(keys.length, keys, rows);
    }

    return `${keys.length} item${keys.length > 1 ? 's' : ''} selected`;
  }

  /** Click handler for main / destructive actions. */
  protected onBulkMainAction(action: TableBulkGeneralAction): void {
    const keys = [...this.resolvedSelectedKeys()];
    const rows = this.selectedRowsFromKeys();

    action.onClick(keys, rows);
  }

  /** Overflow dropdown option selected handler. */
  protected onBulkOverflowSelect(
    oa: TableBulkOverflowAction,
    option: DropdownOption,
  ): void {
    const keys = [...this.resolvedSelectedKeys()];
    const rows = this.selectedRowsFromKeys();

    oa.onSelect(option, keys, rows);
    this.bulkOverflowOpen.set(false);
  }

  /** Close button clears the current selection. */
  protected onBulkClearSelection(_cfg: TableBulkActions): void {
    const rs = this.rowSelection();

    if (
      typeof rs === 'object' &&
      rs !== null &&
      'mode' in rs &&
      rs.mode === 'checkbox'
    ) {
      (rs as TableRowSelectionCheckbox).onChange([], null, []);

      return;
    }

    this.internalSelectedKeys.set(new Set());
    this.selectedRowKeysChange.emit([]);
  }
  protected readonly emptyRowClass = tableClasses.emptyRow;
  protected readonly pinHandleIconClass = tableClasses.pinHandleIcon;
  /**
   * Combined class for the pin `<button>` — mirrors React
   * `cx(classes.dragOrPinHandle, classes.pinHandleIcon)` in
   * `TableDragOrPinHandleCell.tsx`. The first gives flex centering,
   * the second applies the button reset from
   * `_table-styles.scss` so the native `<button>` chrome disappears.
   */
  protected readonly pinHandleButtonClass = clsx(
    tableClasses.dragOrPinHandle,
    tableClasses.pinHandleIcon,
  );
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
  protected readonly dotHorizontalIcon = DotHorizontalIcon;
  protected readonly dotVerticalIcon = DotVerticalIcon;
  protected readonly pinFilledIcon = PinFilledIcon;
  protected readonly pinIcon = PinIcon;
  protected readonly questionOutlineIcon = QuestionOutlineIcon;
  protected readonly starFilledIcon = StarFilledIcon;
  protected readonly starOutlineIcon = StarOutlineIcon;

  /**
   * Per-column `titleMenu` open-state tracker. Keyed by column key so
   * each header dropdown opens independently. Mirrors React
   * `TableColumnTitleMenu`'s local `useState` + `Dropdown` trigger.
   */
  protected readonly titleMenuOpenKey = signal<string | null>(null);

  protected onTitleMenuToggle(columnKey: string): void {
    const current = this.titleMenuOpenKey();

    this.titleMenuOpenKey.set(current === columnKey ? null : columnKey);
  }

  protected onTitleMenuSelect(
    column: TableColumn,
    option: DropdownOption,
  ): void {
    column.titleMenu?.onSelect?.(option);
    this.titleMenuOpenKey.set(null);
  }

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

  /**
   * Data source used for body rendering. When `loading` is true, replaces
   * the real `dataSource` with placeholder rows whose cells render skeletons.
   * Mirrors React `dataSourceForRender` in `packages/react/src/Table/Table.tsx`.
   */
  protected readonly dataSourceForRender = computed(
    (): readonly TableDataSource[] => {
      if (!this.loading()) return this.dataSource();

      const count = Math.max(this.loadingRowsCount(), 1);

      return Array.from({ length: count }, (_, idx) => ({ key: `${idx}` }));
    },
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

  protected readonly resolvedSelectedKeys = computed(
    (): ReadonlySet<string> => {
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
    },
  );

  /* ---------------------------------------------------------------- */
  /*  Class builders                                                   */
  /* ---------------------------------------------------------------- */

  protected getHeaderCellClasses(col: TableColumn): string {
    return clsx(tableClasses.headerCell, this.fixedClassesFor(col), {
      [tableClasses.headerCellFixed]: !!col.fixed,
      [tableClasses.cellFixedShadow]:
        !!col.fixed && !!this.shadowMap().get(col.key),
    });
  }

  protected getHeaderCellActionsClasses(col: TableColumn): string {
    return clsx(
      tableClasses.headerCellActions,
      CELL_ALIGN_MAP[col.align ?? 'start'],
    );
  }

  /**
   * Column-keyed map of static cell classes. Cached so the body template's
   * per-row per-column `[class]` bindings resolve with a `Map.get(key)` O(1)
   * lookup instead of rebuilding the class string on every CD cycle.
   */
  protected readonly cellClassesMap = computed(
    (): ReadonlyMap<string, string> => {
      const cols = this.columns();
      const shadow = this.shadowMap();
      const map = new Map<string, string>();

      for (const col of cols) {
        map.set(
          col.key,
          clsx(tableClasses.cell, this.fixedClassesFor(col), {
            [tableClasses.cellFixedShadow]:
              !!col.fixed && !!shadow.get(col.key),
          }),
        );
      }

      return map;
    },
  );

  protected getCellClasses(col: TableColumn): string {
    return clsx(tableClasses.cell, this.fixedClassesFor(col));
  }

  /**
   * `mzn-table__cell--fixed` + `--fixed-start|--fixed-end` class map for a
   * column, mirroring React `TableCell` / `TableHeader`.
   */
  protected fixedClassesFor(col: TableColumn): Record<string, boolean> {
    const side = col.fixed;

    return {
      [tableClasses.cellFixed]: !!side,
      [tableClasses.cellFixedStart]: side === 'start',
      [tableClasses.cellFixedEnd]: side === 'end',
    };
  }

  /**
   * Column-keyed map of fixed-offset CSS custom properties. Rebuilt only
   * when `columns`, `fixedStartOffsets`, or `fixedEndOffsets` signals
   * change — cheaper than recomputing the object literal per cell per CD.
   */
  protected readonly fixedOffsetStyleMap = computed(
    (): ReadonlyMap<string, Record<string, string>> => {
      const cols = this.columns();
      const starts = this.fixedStartOffsets();
      const ends = this.fixedEndOffsets();
      const map = new Map<string, Record<string, string>>();

      for (const col of cols) {
        if (col.fixed === 'start') {
          map.set(col.key, {
            '--fixed-start-offset': `${starts.get(col.key) ?? 0}px`,
          });
        } else if (col.fixed === 'end') {
          map.set(col.key, {
            '--fixed-end-offset': `${ends.get(col.key) ?? 0}px`,
          });
        } else {
          map.set(col.key, {});
        }
      }

      return map;
    },
  );

  /** px offset to apply to a fixed column's `<td>`/`<th>` via CSS var. */
  protected fixedOffsetStyle(col: TableColumn): Record<string, string> {
    if (col.fixed === 'start') {
      const offset = this.fixedStartOffsets().get(col.key) ?? 0;

      return { '--fixed-start-offset': `${offset}px` };
    }

    if (col.fixed === 'end') {
      const offset = this.fixedEndOffsets().get(col.key) ?? 0;

      return { '--fixed-end-offset': `${offset}px` };
    }

    return {};
  }

  /** Fixed-offset style for the actions column's `<td>` / `<th>`. */
  protected getActionsFixedOffsetStyle(
    actions: TableActions,
  ): Record<string, string> {
    if (actions.fixed === 'start') {
      return { '--fixed-start-offset': '0px' };
    }

    if (actions.fixed === 'end') {
      const offset = this.actionsFixedEndOffset();

      return { '--fixed-end-offset': `${offset}px` };
    }

    return {};
  }

  /** Class map for the actions column header `<th>`, including sticky flags. */
  protected getActionsHeaderCellClasses(
    actions: TableActions,
  ): Record<string, boolean> {
    const side = actions.fixed;
    const shadow = !!side && !!this.shadowMap().get(TABLE_ACTIONS_KEY);

    return {
      [tableClasses.headerCell]: true,
      [tableClasses.cellFixed]: !!side,
      [tableClasses.cellFixedStart]: side === 'start',
      [tableClasses.cellFixedEnd]: side === 'end',
      [tableClasses.cellFixedShadow]: shadow,
      [tableClasses.headerCellFixed]: !!side,
    };
  }

  /** Class map for the actions column body `<td>`, including sticky flags. */
  protected getActionsBodyCellClasses(
    actions: TableActions,
  ): Record<string, boolean> {
    const side = actions.fixed;
    const shadow = !!side && !!this.shadowMap().get(TABLE_ACTIONS_KEY);

    return {
      [tableClasses.cell]: true,
      [tableClasses.cellFixed]: !!side,
      [tableClasses.cellFixedStart]: side === 'start',
      [tableClasses.cellFixedEnd]: side === 'end',
      [tableClasses.cellFixedShadow]: shadow,
    };
  }

  /** Column-keyed map of cell-content classes (ellipsis + align). */
  protected readonly cellContentClassesMap = computed(
    (): ReadonlyMap<string, string> => {
      const cols = this.columns();
      const map = new Map<string, string>();

      for (const col of cols) {
        const ellipsis = col.ellipsis ?? true;

        map.set(
          col.key,
          clsx(tableClasses.cellContent, CELL_ALIGN_MAP[col.align ?? 'start'], {
            [tableClasses.cellEllipsis]: ellipsis,
          }),
        );
      }

      return map;
    },
  );

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

  /**
   * Row-index-keyed cache of computed row classes. Built only when any of
   * the source signals (dataSource, selection, transition, row state,
   * separator, hover, zebra) change — turns per-CD-cycle per-row
   * `getRowClasses()` work into a single `Map.get($index)` lookup in the
   * template. Critical during drag, where CDK's pointermove lands inside
   * NgZone and would otherwise force N×clsx allocations every frame.
   */
  protected readonly rowClassesMap = computed(
    (): ReadonlyMap<number, string> => {
      const data = this.dataSourceForRender();
      const ts = this.transitionState();
      const sep = this.separatorAtRowIndexes();
      const selected = this.resolvedSelectedKeys();
      const zebra = this.zebraStriping();
      const hoveredRow = this.hoveredRowIndex();
      const mode = this.highlight();
      const highlightRow =
        hoveredRow !== null && (mode === 'row' || mode === 'cross');

      const map = new Map<number, string>();

      data.forEach((record, idx) => {
        const key = getRowKey(record);
        const state = this.getRowState(record);

        map.set(
          idx,
          clsx(tableClasses.bodyRow, {
            [tableClasses.bodyRowHighlight]: highlightRow && hoveredRow === idx,
            [tableClasses.bodyRowSelected]: selected.has(key),
            [tableClasses.bodyRowZebra]: zebra && idx % 2 === 1,
            [tableClasses.bodyRowAdding]: ts?.addingKeys.has(key) ?? false,
            [tableClasses.bodyRowDeleting]: ts?.deletingKeys.has(key) ?? false,
            [tableClasses.bodyRowFadingOut]:
              ts?.fadingOutKeys.has(key) ?? false,
            [tableClasses.bodyRowSeparator]: sep?.includes(idx) ?? false,
            [tableClasses.bodyRowStateAdded]: state === 'added',
            [tableClasses.bodyRowStateDeleted]: state === 'deleted',
            [tableClasses.bodyRowStateDisabled]: state === 'disabled',
          }),
        );
      });

      return map;
    },
  );

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
  /**
   * Narrowing helper for templates. Angular strict-template type
   * inference on discriminated unions through `@if (action.type ===
   * 'dropdown')` is unreliable, so we return the narrowed item (or
   * null) and rely on `@if (...; as dropAction)` to bind the alias.
   */
  protected asDropdownAction(
    action: TableActionItem,
  ): TableActionDropdownItem | null {
    return action.type === 'dropdown'
      ? (action as TableActionDropdownItem)
      : null;
  }

  /** Narrowing counterpart for the button branch. */
  protected asButtonAction(
    action: TableActionItem,
  ): TableActionButtonItem | null {
    return action.type !== 'dropdown'
      ? (action as TableActionButtonItem)
      : null;
  }

  protected resolveActionVariant(
    item: TableActionItem,
    actions: TableActions,
  ): TableActionVariant {
    if (item.variant) return item.variant;

    if (actions.variant) return actions.variant;

    // Legacy `danger` fallback only makes sense on button-style items;
    // dropdown items don't carry that field in React either.
    if ('danger' in item && item.danger) {
      return 'destructive-text-link';
    }

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
    // Run the preview-styling pipeline outside Angular so neither the DOM
    // measurements nor the RAF callback trigger change detection.
    this.ngZone.runOutsideAngular(() => {
      const row = event.source.element.nativeElement as HTMLTableRowElement;
      const rowHeight = row.getBoundingClientRect().height;
      const columns = this.columns();

      // Derive width for each data column the same way React does
      // (`calculateColumnWidths` → packages/react/src/Table/utils/…). This
      // avoids measuring `getBoundingClientRect` which, with the default
      // content-box box-sizing, would double-count horizontal padding and
      // drift the preview cells a couple of pixels wider than their source.
      const actionColumnsWidth =
        (this.isDragEnabled() || this.isPinEnabled()
          ? DRAG_OR_PIN_HANDLE_COLUMN_WIDTH
          : 0) +
        (this.hasSelection() ? SELECTION_COLUMN_WIDTH : 0) +
        (this.isExpandableEnabled() ? EXPANSION_COLUMN_WIDTH : 0) +
        (this.toggleable()?.enabled ? TOGGLEABLE_COLUMN_WIDTH : 0) +
        (this.collectable()?.enabled ? COLLECTABLE_COLUMN_WIDTH : 0);

      const containerEl = row.closest<HTMLElement>('tbody')?.parentElement;
      const containerWidth =
        containerEl?.getBoundingClientRect().width ?? this.containerWidth();

      const columnWidthMap = calculateColumnWidths({
        actionColumnsWidth,
        columns,
        containerWidth,
        getResizedColumnWidth: (key) => this.resizedWidths().get(key),
      });

      // Source cells: lock widths so the placeholder (invisible via
      // `.cdk-drag-placeholder { opacity: 0 }`) keeps its footprint in
      // tbody and the table layout doesn't collapse.
      const sourceCells = Array.from(
        row.querySelectorAll<HTMLElement>(':scope > td, :scope > th'),
      );
      const sourceWidths = sourceCells.map(
        (cell) => cell.getBoundingClientRect().width,
      );

      sourceCells.forEach((el, i) => {
        const w = sourceWidths[i];

        if (w == null) return;

        el.style.width = `${w}px`;
        el.style.minWidth = `${w}px`;
      });

      const resolvePreviewCellWidth = (
        el: HTMLElement,
        fallback: number | undefined,
      ): number | undefined => {
        const key = el.getAttribute('data-column-key');

        if (key && columnWidthMap.has(key)) {
          return columnWidthMap.get(key);
        }

        return fallback;
      };

      const applyPreviewStyles = (): void => {
        const preview =
          document.querySelector<HTMLElement>('.cdk-drag-preview');

        if (!preview) return;

        preview.style.height = `${rowHeight}px`;
        preview.style.boxSizing = 'border-box';

        const previewCells = preview.querySelectorAll<HTMLElement>(
          ':scope > td, :scope > th',
        );

        previewCells.forEach((el, i) => {
          // Use border-box so inline `width: Xpx` matches the rendered box
          // (no padding/border double-count from the default content-box).
          el.style.boxSizing = 'border-box';

          const width = resolvePreviewCellWidth(el, sourceWidths[i]);

          if (width == null) return;

          el.style.width = `${width}px`;
          el.style.minWidth = `${width}px`;
          el.style.flex = `0 0 ${width}px`;
          el.style.height = `${rowHeight}px`;
        });
      };

      applyPreviewStyles();
      // Re-apply on the next frame — CDK positions the preview after the
      // `cdkDragStarted` emit, which can reset inline styles on first paint.
      requestAnimationFrame(applyPreviewStyles);
    });
  }

  protected onDragEnded(event: CdkDragEnd): void {
    this.ngZone.runOutsideAngular(() => {
      const row = event.source.element.nativeElement as HTMLElement;

      row
        .querySelectorAll<HTMLElement>(':scope > td, :scope > th')
        .forEach((el) => {
          el.style.width = '';
          el.style.minWidth = '';
        });
    });
  }

  /**
   * Manual auto-scroll for the scroll container. CDK's built-in
   * `_startScrollingIfNecessary` walks ancestors looking for
   * `overflow: auto/scroll`, but `overlayscrollbars` wraps the real
   * scroll element in layers with `overflow: hidden` — CDK loses track.
   * We instead grab the OverlayScrollbars viewport (data attribute set
   * by the library) and scroll it directly when the pointer nears the
   * top/bottom edge. Mirrors React `@hello-pangea/dnd`'s auto-scroller.
   */
  protected onDragMoved(event: CdkDragMove): void {
    this.ngZone.runOutsideAngular(() => {
      const viewport = this.scrollViewport;

      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const pointerY = event.pointerPosition.y;
      const threshold = 48; // px from edge to start scrolling
      const maxStep = 14; // px per frame at the edge — matches dnd feel

      let delta = 0;

      if (pointerY < rect.top + threshold) {
        const ratio = (rect.top + threshold - pointerY) / threshold;

        delta = -Math.min(maxStep, maxStep * ratio);
      } else if (pointerY > rect.bottom - threshold) {
        const ratio = (pointerY - (rect.bottom - threshold)) / threshold;

        delta = Math.min(maxStep, maxStep * ratio);
      }

      if (delta !== 0) viewport.scrollTop += delta;
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
