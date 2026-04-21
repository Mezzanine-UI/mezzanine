import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { contentHeaderClasses as classes } from '@mezzanine-ui/core/content-header';
import { TypographySemanticType } from '@mezzanine-ui/system/typography';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznButton } from '@mezzanine-ui/ng/button';
import { ChevronLeftIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';

export type ContentHeaderSize = 'main' | 'sub';

export type ContentHeaderTitleComponent =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p';

/**
 * 內容區塊標題元件，支援標題、描述、返回按鈕、篩選器、操作區與工具列。
 *
 * 使用 content projection 的具名插槽組合彈性版面：
 * - `[contentHeaderBackButton]` — 返回按鈕（僅 `main` size 顯示）
 * - `[contentHeaderFilter]` — 篩選器區域（等效 React `filter` prop / 子元件）
 * - `[contentHeaderActions]` — 操作按鈕區域（等效 React `actions` prop / 子元件）
 * - `[contentHeaderUtilities]` — 工具列區域（等效 React `utilities` prop / 子元件）
 *
 * 若要程式化觸發返回動作（等效 React `onBackClick` prop），可綁定 `(backClick)` 輸出事件：
 * 此時元件會自動在標題左側渲染一個返回圖示按鈕，點擊後發出事件。
 *
 * @example
 * ```html
 * import { MznContentHeader } from '@mezzanine-ui/ng/content-header';
 *
 * <!-- 基本用法：使用 ng-content 插槽 -->
 * <header mznContentHeader title="頁面標題" description="描述文字">
 *   <button contentHeaderBackButton mznButton variant="base-ghost">返回</button>
 *   <div contentHeaderFilter>
 *     <input mznInput placeholder="搜尋..." />
 *   </div>
 *   <div contentHeaderActions>
 *     <button mznButton variant="base-primary">新增</button>
 *   </div>
 *   <div contentHeaderUtilities>
 *     <button mznButton iconType="icon-only"><i mznIcon [icon]="PlusIcon" ></i></button>
 *   </div>
 * </header>
 *
 * <!-- 程式化返回按鈕（等效 React onBackClick） -->
 * <header mznContentHeader title="頁面標題" (backClick)="handleBack()">
 * </header>
 * ```
 *
 * @see MznButton
 * @see MznContentHeaderResponsive
 */
@Component({
  selector: '[mznContentHeader]',
  standalone: true,
  imports: [MznTypography, MznIcon, MznButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.description]': 'null',
    '[attr.size]': 'null',
    '[attr.showBackButton]': 'null',
    '[attr.title]': 'null',
    '[attr.titleComponent]': 'null',
  },
  template: `
    <span [class]="titleAreaClass">
      @if (size() === 'main') {
        <span [class]="backButtonClass">
          @if (showBackButton()) {
            <button
              mznButton
              type="button"
              variant="base-tertiary"
              size="sub"
              iconType="icon-only"
              aria-label="Back"
              (click)="backClick.emit()"
            >
              <i mznIcon [icon]="chevronLeftIcon" [size]="16"></i>
            </button>
          } @else {
            <ng-content select="[contentHeaderBackButton]" />
          }
        </span>
      }
      <span [class]="textGroupClass">
        @switch (resolvedTitleComponent()) {
          @case ('h1') {
            <h1
              mznTypography
              [variant]="titleTypographyVariant()"
              align="left"
              color="text-neutral-solid"
              >{{ title() }}</h1
            >
          }
          @case ('h2') {
            <h2
              mznTypography
              [variant]="titleTypographyVariant()"
              align="left"
              color="text-neutral-solid"
              >{{ title() }}</h2
            >
          }
          @case ('h3') {
            <h3
              mznTypography
              [variant]="titleTypographyVariant()"
              align="left"
              color="text-neutral-solid"
              >{{ title() }}</h3
            >
          }
          @case ('h4') {
            <h4
              mznTypography
              [variant]="titleTypographyVariant()"
              align="left"
              color="text-neutral-solid"
              >{{ title() }}</h4
            >
          }
          @case ('h5') {
            <h5
              mznTypography
              [variant]="titleTypographyVariant()"
              align="left"
              color="text-neutral-solid"
              >{{ title() }}</h5
            >
          }
          @case ('h6') {
            <h6
              mznTypography
              [variant]="titleTypographyVariant()"
              align="left"
              color="text-neutral-solid"
              >{{ title() }}</h6
            >
          }
          @default {
            <p
              mznTypography
              [variant]="titleTypographyVariant()"
              align="left"
              color="text-neutral-solid"
              >{{ title() }}</p
            >
          }
        }
        @if (description()) {
          <span
            mznTypography
            variant="caption"
            align="left"
            color="text-neutral"
          >
            {{ description() }}
          </span>
        }
      </span>
    </span>
    <span [class]="actionAreaClass">
      <ng-content select="[contentHeaderFilter]" />
      <ng-content select="[contentHeaderActions]" />
      <span [class]="utilitiesClass">
        <ng-content select="[contentHeaderUtilities]" />
      </span>
    </span>
  `,
})
export class MznContentHeader {
  protected readonly actionAreaClass = classes.actionArea;
  protected readonly backButtonClass = classes.backButton;
  protected readonly chevronLeftIcon = ChevronLeftIcon;
  protected readonly textGroupClass = classes.textGroup;
  protected readonly titleAreaClass = classes.titleArea;
  protected readonly utilitiesClass = classes.utilities;

  /**
   * 程式化返回按鈕點擊事件。
   * 等效於 React 版 `onBackClick` prop。
   * 綁定此事件後，元件會在標題左側自動顯示返回按鈕，點擊後發出此事件。
   */
  readonly backClick = output<void>();

  /** 描述文字。 */
  readonly description = input<string>();

  /**
   * 尺寸。`main` 時顯示返回按鈕插槽，`sub` 時隱藏。
   * @default 'main'
   */
  readonly size = input<ContentHeaderSize>('main');

  /**
   * 是否顯示自動返回按鈕（等效 React `onBackClick` 有值的情境）。
   * 設為 true 時元件會在標題左側自動渲染一個返回 icon button，
   * 點擊時透過 `(backClick)` 發出事件。若同時提供 `[contentHeaderBackButton]`
   * 投影插槽，則自動按鈕優先顯示。
   * @default false
   */
  readonly showBackButton = input(false);

  /** 標題文字。 */
  readonly title = input.required<string>();

  /**
   * 標題的 HTML 元素型別。
   * 預設 `main` size 為 `'h1'`，`sub` size 為 `'h2'`，對應 React 版 `titleComponent` prop。
   */
  readonly titleComponent = input<ContentHeaderTitleComponent>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size())),
  );

  protected readonly resolvedTitleComponent = computed(
    (): ContentHeaderTitleComponent =>
      this.titleComponent() ?? (this.size() === 'main' ? 'h1' : 'h2'),
  );

  protected readonly titleTypographyVariant = computed(
    (): TypographySemanticType => (this.size() === 'main' ? 'h2' : 'h3'),
  );
}
