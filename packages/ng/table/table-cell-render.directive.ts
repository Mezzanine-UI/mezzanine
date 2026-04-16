import { Directive, TemplateRef, inject, input } from '@angular/core';
import type { TableDataSource } from './table-types';

/**
 * Cell render 上下文，傳遞當前列資料與列索引。
 * 對齊 React `column.render(record, index)` 的參數語意。
 */
export interface MznTableCellRenderContext<
  T extends TableDataSource = TableDataSource,
> {
  readonly $implicit: T;
  readonly index: number;
}

/**
 * 結構化指令，以 column key 對應自訂 cell template。
 *
 * React 透過 `column.render: (record, index) => ReactNode` 客製化單元格內容；
 * Angular 等效機制：在 `<div mznTable>` 內投影 `<ng-template mznTableCellRender="columnKey">`，
 * MznTable 收集後對該 column 使用此 template outlet 取代預設 `dataIndex` 取值。
 *
 * @example
 * ```html
 * <div mznTable [columns]="cols" [dataSource]="rows">
 *   <ng-template mznTableCellRender="age" let-record let-i="index">
 *     <span mznTypography variant="body-mono">{{ record.age }}</span>
 *   </ng-template>
 * </div>
 * ```
 */
@Directive({
  selector: '[mznTableCellRender]',
  standalone: true,
})
export class MznTableCellRender<T extends TableDataSource = TableDataSource> {
  readonly templateRef =
    inject<TemplateRef<MznTableCellRenderContext<T>>>(TemplateRef);

  /** 對應 TableColumn.key。 */
  readonly mznTableCellRender = input.required<string>();

  /** Angular 結構化指令上下文類型守衛，便於 `let-record` 自動推斷。 */
  static ngTemplateContextGuard<U extends TableDataSource>(
    _dir: MznTableCellRender<U>,
    _ctx: unknown,
  ): _ctx is MznTableCellRenderContext<U> {
    return true;
  }
}
