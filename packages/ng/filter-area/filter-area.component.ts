import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  output,
  signal,
} from '@angular/core';
import {
  filterAreaClasses as classes,
  FilterAreaActionsAlign,
  FilterAreaRowAlign,
  FilterAreaSize,
} from '@mezzanine-ui/core/filter-area';
import { ChevronDownIcon, ChevronUpIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznButton } from '@mezzanine-ui/ng/button';
import {
  MZN_FILTER_AREA_CONTEXT,
  FilterAreaContextValue,
} from './filter-area-context';
import { MznFilterLine } from './filter-line.component';

/**
 * 篩選器容器元件，管理多個 MznFilterLine 的展示與收合。
 *
 * 預設僅顯示第一行（MznFilterLine），多行時自動出現展開／收合切換按鈕。
 * 透過 `size` 統一控制內部所有表單欄位的尺寸；
 * 透過 `actionsAlign` 調整「送出／重設」按鈕區塊的對齊；
 * 透過 `isDirty` 控制重設按鈕的啟用狀態（`false` 時禁用）。
 *
 * @example
 * ```html
 * import { MznFilterArea, MznFilterLine, MznFilter } from '@mezzanine-ui/ng/filter-area';
 *
 * <div mznFilterArea
 *   submitText="Search"
 *   resetText="Reset"
 *   (filterSubmit)="onSubmit()"
 *   (filterReset)="onReset()"
 * >
 *   <div mznFilterLine>
 *     <div mznFilter [span]="2">...</div>
 *     <div mznFilter [span]="2">...</div>
 *   </div>
 * </div>
 * ```
 *
 * @see {@link MznFilterLine} 用於組成 FilterArea 的單行條件列
 * @see {@link MznFilter} 包裝單一篩選欄位的元件
 */
@Component({
  selector: '[mznFilterArea]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznButton],
  providers: [
    {
      provide: MZN_FILTER_AREA_CONTEXT,
      useFactory: (area: MznFilterArea): FilterAreaContextValue => ({
        expanded: area.expanded,
        get size(): FilterAreaSize {
          return area.size();
        },
      }),
      deps: [MznFilterArea],
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.actionsAlign]': 'null',
    '[attr.isDirty]': 'null',
    '[attr.resetText]': 'null',
    '[attr.rowAlign]': 'null',
    '[attr.size]': 'null',
    '[attr.submitText]': 'null',
    '[attr.resetButtonType]': 'null',
    '[attr.submitButtonType]': 'null',
  },
  template: `
    <!--
      Angular limitation: ng-content cannot appear in two separate structural branches.
      Workaround: single __row wrapper always present. When expanded, flex-direction is
      overridden to column so filter lines stack vertically as in React's expanded layout.
    -->
    <div
      [class]="rowClasses()"
      [style.flex-direction]="expanded() ? 'column' : null"
    >
      <ng-content />
      <div [class]="actionsClasses()">
        <button
          mznButton
          [type]="submitButtonType()"
          [size]="size()"
          (click)="filterSubmit.emit()"
          >{{ submitText() }}</button
        >
        <button
          mznButton
          [type]="resetButtonType()"
          variant="base-secondary"
          [disabled]="!isDirty()"
          [size]="size()"
          (click)="filterReset.emit()"
          >{{ resetText() }}</button
        >
        @if (hasMultipleLines()) {
          <button
            mznButton
            variant="base-ghost"
            iconType="icon-only"
            [icon]="toggleIcon()"
            [size]="size()"
            [attr.aria-expanded]="expanded()"
            [attr.aria-label]="
              expanded() ? 'Collapse filters' : 'Expand filters'
            "
            [attr.title]="expanded() ? 'Collapse filters' : 'Expand filters'"
            (click)="toggleExpanded()"
          ></button>
        }
      </div>
    </div>
  `,
})
export class MznFilterArea {
  /**
   * 操作按鈕區塊的對齊方式。
   * @default 'end'
   */
  readonly actionsAlign = input<FilterAreaActionsAlign>('end');

  /**
   * 表單是否已被修改。為 `false` 時重設按鈕禁用。
   * @default true
   */
  readonly isDirty = input(true);

  /**
   * 重設按鈕文字。
   * @default 'Reset'
   */
  readonly resetText = input('Reset');

  /**
   * Row 的 cross-axis 對齊方式。
   * @default 'center'
   */
  readonly rowAlign = input<FilterAreaRowAlign>('center');

  /**
   * 篩選器的整體尺寸。
   * @default 'main'
   */
  readonly size = input<FilterAreaSize>('main');

  /**
   * 送出按鈕文字。
   * @default 'Search'
   */
  readonly submitText = input('Search');

  /**
   * 重設按鈕的 HTML button type 屬性。
   * @default 'button'
   */
  readonly resetButtonType = input<'button' | 'submit' | 'reset'>('button');

  /**
   * 送出按鈕的 HTML button type 屬性。
   * @default 'button'
   */
  readonly submitButtonType = input<'button' | 'submit' | 'reset'>('button');

  /** 當送出按鈕被點擊時觸發。 */
  readonly filterSubmit = output<void>();

  /** 當重設按鈕被點擊時觸發。 */
  readonly filterReset = output<void>();

  /** 透過 contentChildren 偵測子 MznFilterLine 數量。 */
  readonly filterLines = contentChildren(MznFilterLine);

  /** 內部展開/收合狀態。 */
  readonly expanded = signal(false);

  protected readonly hasMultipleLines = computed(
    (): boolean => this.filterLines().length > 1,
  );

  protected readonly toggleIcon = computed(() =>
    this.expanded() ? ChevronUpIcon : ChevronDownIcon,
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size())),
  );

  protected readonly rowClasses = computed((): string =>
    clsx(classes.row, classes.rowAlign(this.rowAlign())),
  );

  protected readonly actionsClasses = computed((): string =>
    clsx(classes.actions, classes.actionsAlign(this.actionsAlign()), {
      [classes.actionsExpanded]: this.expanded(),
    }),
  );

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }
}
