import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  modalClasses as classes,
  ModalStatusType,
  modalStatusTypeIcons,
} from '@mezzanine-ui/core/modal';
import clsx from 'clsx';
import { IconColor } from '@mezzanine-ui/core/icon';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MZN_MODAL_CONTEXT, ModalContextValue } from './modal-context';

/**
 * Modal 標題列元件。
 *
 * 搭配 `MznModal` 使用，自動從父 Modal 的 context 取得 `modalStatusType`
 * 以決定狀態圖示的顏色與種類。
 *
 * @example
 * ```html
 * import { MznModalHeader } from '@mezzanine-ui/ng/modal';
 *
 * <mzn-modal-header
 *   title="確認刪除"
 *   supportingText="此操作無法復原"
 *   [showStatusTypeIcon]="true"
 * />
 * ```
 *
 * @see MznModal
 */
@Component({
  selector: 'mzn-modal-header',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    @if (showStatusTypeIcon()) {
      <div [class]="statusTypeIconClass">
        <i
          mznIcon
          [icon]="statusIcon()"
          [color]="statusIconColor()"
          [size]="20"
        ></i>
      </div>
    }
    <div [class]="titleContainerClass">
      <h2 [class]="titleClasses()" [title]="title()">{{ title() }}</h2>
      @if (supportingText()) {
        <p [class]="supportingTextClasses()">{{ supportingText() }}</p>
      }
    </div>
  `,
})
export class MznModalHeader {
  private readonly modalContext = inject<ModalContextValue>(MZN_MODAL_CONTEXT, {
    optional: true,
  });

  /** 標題文字。 */
  readonly title = input.required<string>();

  /** 是否顯示狀態類型圖示。 */
  readonly showStatusTypeIcon = input(false);

  /** 圖示排版方向。 */
  readonly statusTypeIconLayout = input<'horizontal' | 'vertical'>('vertical');

  /** 輔助說明文字。 */
  readonly supportingText = input<string>();

  /** 輔助說明文字對齊。 */
  readonly supportingTextAlign = input<'center' | 'left'>('left');

  /** 標題文字對齊。 */
  readonly titleAlign = input<'center' | 'left'>('left');

  private readonly resolvedStatusType = computed(
    (): ModalStatusType => this.modalContext?.modalStatusType() ?? 'info',
  );

  protected readonly statusIcon = computed(
    () => modalStatusTypeIcons[this.resolvedStatusType()],
  );

  protected readonly statusIconColor = computed((): IconColor => {
    const t = this.resolvedStatusType();

    switch (t) {
      case 'success':
        return 'success-strong';
      case 'warning':
        return 'warning';
      case 'error':
      case 'delete':
        return 'error-solid';
      case 'info':
      case 'email':
      default:
        return 'info-strong';
    }
  });

  protected readonly hostClasses = computed((): string =>
    clsx(classes.modalHeader, {
      [`${classes.modalHeader}--horizontal`]:
        this.statusTypeIconLayout() === 'horizontal',
      [`${classes.modalHeader}--vertical`]:
        this.statusTypeIconLayout() === 'vertical',
      [`${classes.modalHeader}--title-align-left`]:
        this.titleAlign() === 'left',
      [`${classes.modalHeader}--title-align-center`]:
        this.titleAlign() === 'center',
      [`${classes.modalHeader}--show-modal-status-type-icon`]:
        this.showStatusTypeIcon(),
    }),
  );

  protected readonly titleClasses = computed((): string =>
    clsx(classes.modalHeaderTitle),
  );

  protected readonly supportingTextClasses = computed((): string =>
    clsx(classes.modalHeaderSupportingText, {
      [`${classes.modalHeaderSupportingText}--align-left`]:
        this.supportingTextAlign() === 'left',
      [`${classes.modalHeaderSupportingText}--align-center`]:
        this.supportingTextAlign() === 'center',
    }),
  );

  protected readonly statusTypeIconClass = classes.modalHeaderStatusTypeIcon;
  protected readonly titleContainerClass =
    classes.modalHeaderTitleAndSupportingTextContainer;
}
