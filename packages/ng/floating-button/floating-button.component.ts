import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { IconDefinition } from '@mezzanine-ui/icons';
import { ButtonIconType } from '@mezzanine-ui/core/button';
import { floatingButtonClasses as classes } from '@mezzanine-ui/core/floating-button';

import { MznButton } from '../button/button.directive';
import { MznIcon } from '../icon/icon.component';

/**
 * 浮動按鈕元件，固定於畫面角落的操作按鈕容器。
 *
 * 內部封裝一顆 `MznButton`（強制 `variant="base-primary"` / `size="main"` /
 * `tooltipPosition="left"`），對應 React `<FloatingButton>` 的結構。
 * 使用 attribute selector 套用於 `<div>`，host element 為 `<div>` 以與 React 完全一致。
 *
 * @example
 * ```html
 * import { MznFloatingButton } from '@mezzanine-ui/ng/floating-button';
 *
 * <div mzn-floating-button [icon]="PlusIcon" iconType="leading">Button</div>
 *
 * <div mzn-floating-button [autoHideWhenOpen]="true" [open]="open()" (click)="toggle()">
 *   Open
 * </div>
 * ```
 */
@Component({
  selector: '[mznFloatingButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznButton, MznIcon],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <button
      mznButton
      variant="base-primary"
      size="main"
      tooltipPosition="left"
      [class.mzn-floating-button__button]="true"
      [class.mzn-floating-button__button--hidden]="hidden()"
      [disabled]="disabled()"
      [disabledTooltip]="disabledTooltip()"
      [icon]="icon()"
      [iconType]="iconType()"
      [loading]="loading()"
    >
      @if (icon() && iconType() !== 'trailing') {
        <i mznIcon [icon]="icon()!"></i>
      }
      @if (iconType() !== 'icon-only') {
        <ng-content />
      }
      @if (icon() && iconType() === 'trailing') {
        <i mznIcon [icon]="icon()!"></i>
      }
    </button>
  `,
})
export class MznFloatingButton {
  /**
   * 是否在 `open` 為 true 時自動隱藏按鈕。
   * @default false
   */
  readonly autoHideWhenOpen = input(false);

  /**
   * 是否禁用內部按鈕。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否禁用 icon-only 模式的自動 tooltip。
   * @default false
   */
  readonly disabledTooltip = input(false);

  /** 按鈕圖示定義（來自 `@mezzanine-ui/icons`）。 */
  readonly icon = input<IconDefinition>();

  /**
   * 圖示排列方式。
   */
  readonly iconType = input<ButtonIconType>();

  /**
   * 是否顯示載入狀態。
   * @default false
   */
  readonly loading = input(false);

  /**
   * 是否為展開狀態。搭配 `autoHideWhenOpen` 使用。
   * @default false
   */
  readonly open = input(false);

  protected readonly hostClasses = computed((): string => classes.host);

  protected readonly hidden = computed(
    (): boolean => this.autoHideWhenOpen() && this.open(),
  );
}
