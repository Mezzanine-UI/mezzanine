/**
 * 排序方向。
 * - `'ascend'` — 升冪排序
 * - `'descend'` — 降冪排序
 * - `null` — 未排序
 */
export type SortOrder = 'ascend' | 'descend' | null;

/**
 * 欄位對齊方式。
 * - `'start'` — 靠左對齊
 * - `'center'` — 置中對齊
 * - `'end'` — 靠右對齊
 */
export type ColumnAlign = 'start' | 'center' | 'end';

/**
 * 表格尺寸。
 * - `'main'` — 標準尺寸
 * - `'sub'` — 較小尺寸
 */
export type TableSize = 'main' | 'sub';

/**
 * 資料列狀態。
 * - `'added'` — 新增列
 * - `'deleted'` — 刪除列
 * - `'disabled'` — 停用列
 */
export type TableRowState = 'added' | 'deleted' | 'disabled';

/** 表格資料來源基礎型別，每筆資料至少需有 `key` 或 `id` 供辨識。 */
export interface TableDataSource {
  readonly [key: string]: unknown;
  readonly key?: string;
  readonly id?: string;
}

/** 取得資料列的唯一辨識鍵。優先使用 `key`，其次 `id`。 */
export function getRowKey(record: TableDataSource): string {
  if (record['key'] != null) return String(record['key']);
  if (record['id'] != null) return String(record['id']);

  return '';
}

/** Drag-and-drop configuration for the table. */
export interface TableDraggable {
  readonly enabled: boolean;
  readonly fixedRowKeys?: readonly string[];
  readonly onDragEnd?: (
    newDataSource: readonly TableDataSource[],
    options: { draggingId: string; fromIndex: number; toIndex: number },
  ) => void;
}

/** 欄位定義。 */
export interface TableColumn {
  /** 欄位對齊方式。 */
  readonly align?: ColumnAlign;
  /** 對應 dataSource 中的欄位名稱。 */
  readonly dataIndex?: string;
  /**
   * 是否啟用內容超長省略 (ellipsis)。
   * 對齊 React `TableColumn.ellipsis`，預設 `true`。
   * @default true
   */
  readonly ellipsis?: boolean;
  /** 欄位唯一識別鍵。 */
  readonly key: string;
  /** 最大欄位寬度（px）。搭配 resizable 使用。 */
  readonly maxWidth?: number;
  /** 最小欄位寬度（px）。搭配 resizable 使用時為必填。 */
  readonly minWidth?: number;
  /** 排序變更時的回呼函式。 */
  readonly onSort?: (key: string, order: SortOrder) => void;
  /** 當前排序方向，設為 `undefined` 代表不可排序。 */
  readonly sortOrder?: SortOrder;
  /** 欄位標題。 */
  readonly title?: string;
  /** 欄位寬度。 */
  readonly width?: number | string;
}

/**
 * 收藏欄位設定。
 * 啟用後會在表格新增一個收藏按鈕欄，追蹤每列是否已收藏。
 */
export interface TableCollectable {
  /** 欄位對齊方式。 */
  readonly align?: ColumnAlign;
  /** 已收藏的列 key 陣列。 */
  readonly collectedRowKeys?: readonly string[];
  /** 是否啟用收藏功能。 */
  readonly enabled: boolean;
  /** 固定欄位位置。 */
  readonly fixed?: boolean;
  /** 判斷特定列的收藏功能是否停用。 */
  readonly isRowDisabled?: (record: TableDataSource) => boolean;
  /** 欄位最小寬度（px）。 */
  readonly minWidth?: number;
  /** 收藏狀態變更時的回呼。 */
  readonly onCollectChange?: (
    record: TableDataSource,
    collected: boolean,
  ) => void;
  /** 欄位標題文字。 */
  readonly title?: string;
  /** 欄位標題說明。 */
  readonly titleHelp?: string;
}

/**
 * 分頁設定，對應 MznPagination 的 inputs。
 */
export interface TablePagination {
  /** 目前頁碼。 */
  readonly current?: number;
  /** 是否停用。 */
  readonly disabled?: boolean;
  /** 每頁筆數。 */
  readonly pageSize?: number;
  /** 總筆數。 */
  readonly total: number;
  /** 頁碼變更時的回呼。 */
  readonly onChange?: (page: number) => void;
}

/**
 * 列釘選設定。
 * 啟用後可將特定列釘選至頂端。
 * 注意：draggable 與 pinnable 不可同時啟用。
 */
export interface TablePinnable {
  /** 是否啟用釘選功能。 */
  readonly enabled: boolean;
  /** 固定欄位位置。 */
  readonly fixed?: boolean;
  /** 釘選狀態變更時的回呼。 */
  readonly onPinChange?: (record: TableDataSource, pinned: boolean) => void;
  /** 已釘選的列 key 陣列。 */
  readonly pinnedRowKeys?: readonly string[];
}

/**
 * 捲動設定，支援虛擬捲動。
 */
export interface TableScroll {
  /**
   * 垂直捲動高度限制。
   * 設定捲動容器的 max-height。
   */
  readonly y?: number | string;
}

/**
 * 欄位顯示切換設定。
 * 啟用後會在表格新增一個開關欄，追蹤每列是否顯示。
 */
export interface TableToggleable {
  /** 欄位對齊方式。 */
  readonly align?: ColumnAlign;
  /** 是否啟用切換功能。 */
  readonly enabled: boolean;
  /** 固定欄位位置。 */
  readonly fixed?: boolean;
  /** 判斷特定列的切換功能是否停用。 */
  readonly isRowDisabled?: (record: TableDataSource) => boolean;
  /** 欄位最小寬度（px）。 */
  readonly minWidth?: number;
  /** 切換狀態變更時的回呼。 */
  readonly onToggleChange?: (record: TableDataSource, toggled: boolean) => void;
  /** 欄位標題文字。 */
  readonly title?: string;
  /** 欄位標題說明。 */
  readonly titleHelp?: string;
  /** 已切換啟用的列 key 陣列。 */
  readonly toggledRowKeys?: readonly string[];
}

/**
 * 資料列進入／離開動畫的過渡狀態，搭配 useTableDataSource hook 使用。
 */
export interface TableTransitionState {
  /** 正在「新增中」高亮動畫的列 key 集合。 */
  readonly addingKeys: ReadonlySet<string>;
  /** 正在「刪除中」紅色高亮動畫的列 key 集合。 */
  readonly deletingKeys: ReadonlySet<string>;
  /** 正在淡出動畫的列 key 集合。 */
  readonly fadingOutKeys: ReadonlySet<string>;
}

/**
 * 高亮模式。
 * - `'row'` — 整列高亮
 * - `'cell'` — 單格高亮
 * - `'cross'` — 十字交叉高亮
 * - `'none'` — 不高亮
 */
export type HighlightMode = 'row' | 'cell' | 'column' | 'cross' | 'none';

/**
 * 列高預設值。
 * - `'base'` — 標準列高
 * - `'condensed'` — 緊湊列高
 * - `'detailed'` — 詳細列高
 * - `'roomy'` — 寬鬆列高
 */
export type RowHeightPreset = 'base' | 'condensed' | 'detailed' | 'roomy';

/* ------------------------------------------------------------------ */
/*  Row Selection Types (mirrors React's TableRowSelection)            */
/* ------------------------------------------------------------------ */

/** 勾選模式。 */
export type TableSelectionMode = 'checkbox' | 'radio';

/** 列選取基礎設定。 */
export interface TableRowSelectionBase {
  /** 固定選取欄位位置。 */
  readonly fixed?: boolean;
  /** 判斷該列的選取控件是否停用。 */
  readonly isSelectionDisabled?: (record: TableDataSource) => boolean;
}

/** Checkbox 模式的列選取設定。 */
export interface TableRowSelectionCheckbox extends TableRowSelectionBase {
  /** 選取模式。 */
  readonly mode: 'checkbox';
  /** 隱藏表頭的全選 checkbox。 */
  readonly hideSelectAll?: boolean;
  /** 選取變更時的回呼。 */
  readonly onChange: (
    selectedRowKeys: readonly string[],
    selectedRow: TableDataSource | null,
    selectedRows: readonly TableDataSource[],
  ) => void;
  /** 全選觸發時的回呼，在 onChange 之後呼叫。 */
  readonly onSelectAll?: (type: 'all' | 'none') => void;
  /** 已選取的列 key 陣列。 */
  readonly selectedRowKeys: readonly string[];
}

/** Radio 模式的列選取設定。 */
export interface TableRowSelectionRadio extends TableRowSelectionBase {
  /** 選取模式。 */
  readonly mode: 'radio';
  /** 選取變更時的回呼。 */
  readonly onChange: (
    selectedRowKey: string | undefined,
    selectedRow: TableDataSource | null,
  ) => void;
  /** 已選取的列 key。 */
  readonly selectedRowKey: string | undefined;
}

/** 列選取設定——discriminated union。 */
export type TableRowSelection =
  | TableRowSelectionCheckbox
  | TableRowSelectionRadio;

/* ------------------------------------------------------------------ */
/*  Actions Column Types (mirrors React's TableActions)                */
/* ------------------------------------------------------------------ */

/** 單一動作項目。 */
export interface TableActionItem {
  /** 動作 key。 */
  readonly key: string;
  /** 動作標籤。 */
  readonly label: string;
  /** 圖示。 */
  readonly icon?: unknown;
  /** 是否為危險動作。 */
  readonly danger?: boolean;
  /** 是否停用。 */
  readonly disabled?: boolean;
  /** 點擊回呼。 */
  readonly onClick?: (record: TableDataSource, index: number) => void;
}

/** 動作欄設定。 */
export interface TableActions {
  /** 欄位對齊方式。 @default 'end' */
  readonly align?: ColumnAlign;
  /** 欄位標題文字。 */
  readonly title?: string;
  /** 欄位寬度。 */
  readonly width?: number | string;
  /** 欄位最小寬度。 */
  readonly minWidth?: number;
  /** 固定位置。 */
  readonly fixed?: 'start' | 'end';
  /** 產生動作項目的函式。 */
  readonly render: (
    record: TableDataSource,
    index: number,
  ) => readonly TableActionItem[];
}

/* ------------------------------------------------------------------ */
/*  Expandable                                                         */
/* ------------------------------------------------------------------ */

/**
 * 展開列設定，對應 React 的 `TableExpandable<T>`。
 *
 * Angular 版以 `TemplateRef` 取代 React 的 `expandedRowRender` function
 * prop：消費端宣告 `<ng-template #tpl let-record>…</ng-template>` 後
 * 將其傳入 `template`。`$implicit` 會綁到當前 row 資料。
 *
 * @example
 * ```html
 * <ng-template #expandedTpl let-record>
 *   <div>Details for {{ record.name }}</div>
 * </ng-template>
 *
 * <div mznTable
 *   [columns]="columns"
 *   [dataSource]="data"
 *   [expandable]="{
 *     template: expandedTpl,
 *     expandedRowKeys: openKeys,
 *     onExpand: handleExpand,
 *   }"
 * ></div>
 * ```
 */
export interface TableExpandable<T extends TableDataSource = TableDataSource> {
  /** 展開列內容模板。row 資料透過 `$implicit` 綁定。 */
  readonly template?: import('@angular/core').TemplateRef<{
    $implicit: T;
  }>;
  /** 受控的展開列 key 陣列。未提供則元件內部自行管理 state。 */
  readonly expandedRowKeys?: readonly string[];
  /**
   * 展開圖示欄位是否固定於左側。
   * @default false
   */
  readonly fixed?: boolean;
  /** 單列展開狀態變更的回呼。 */
  readonly onExpand?: (expanded: boolean, record: T) => void;
  /** 展開列集合變更的回呼。 */
  readonly onExpandedRowsChange?: (expandedRowKeys: readonly string[]) => void;
  /** 判斷某列是否允許展開。回傳 false 的列會隱藏展開圖示。 */
  readonly rowExpandable?: (record: T) => boolean;
}

/* ------------------------------------------------------------------ */
/*  Empty Props (mirrors React's EmptyProps subset used in Table)      */
/* ------------------------------------------------------------------ */

/** 空狀態設定，對應 MznEmpty 元件的 inputs。 */
export interface TableEmptyProps {
  /** 空狀態標題。 */
  readonly title: string;
  /** 空狀態描述文字。 */
  readonly description?: string;
  /** 空狀態類型。 @default 'initial-data' */
  readonly type?:
    | 'initial-data'
    | 'result'
    | 'system'
    | 'notification'
    | 'custom';
  /** 空狀態尺寸。 @default 'main' */
  readonly size?: 'main' | 'sub' | 'minor';
  /** 容器高度。 */
  readonly height?: number | string;
}
