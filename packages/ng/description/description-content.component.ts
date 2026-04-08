import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  descriptionClasses as classes,
  DescriptionContentVariant,
  DescriptionSize,
} from '@mezzanine-ui/core/description';
import {
  CaretUpIcon,
  CaretDownIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MZN_DESCRIPTION_CONTEXT } from './description-context';

/**
 * Description 內容元件。
 *
 * 支援 `trend-up`、`trend-down`、`with-icon` 等變體，並可傳入自訂圖示與點擊事件。
 *
 * @example
 * ```html
 * <span mznDescriptionContent variant="statistic">12,345</span>
 * <span mznDescriptionContent variant="with-icon" [icon]="CopyIcon" (clickIcon)="onCopy()">
 *   rytass.com
 * </span>
 * ```
 */
@Component({
  selector: '[mznDescriptionContent]',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.icon]': 'null',
    '[attr.size]': 'null',
    '[attr.variant]': 'null',
  },
  template: `
    @if (variant() === 'trend-up') {
      <i
        mznIcon
        [class]="classes.contentTrendUp"
        [icon]="caretUpIcon"
        [size]="16"
      ></i>
    }
    @if (variant() === 'trend-down') {
      <i
        mznIcon
        [class]="classes.contentTrendDown"
        [icon]="caretDownIcon"
        [size]="16"
      ></i>
    }
    <ng-content />
    @if (variant() === 'with-icon' && icon()) {
      <i
        mznIcon
        [class]="classes.contentIcon"
        [icon]="icon()!"
        [size]="16"
        (click)="clickIcon.emit()"
      ></i>
    }
  `,
})
export class MznDescriptionContent {
  protected readonly classes = classes;
  protected readonly caretUpIcon = CaretUpIcon;
  protected readonly caretDownIcon = CaretDownIcon;

  private readonly context = inject(MZN_DESCRIPTION_CONTEXT, {
    optional: true,
  });

  /**
   * 自訂圖示（僅在 `variant="with-icon"` 時生效）。
   */
  readonly icon = input<IconDefinition | undefined>(undefined);

  /**
   * 尺寸（優先使用父層 Description 提供的值）。
   */
  readonly size = input<DescriptionSize>();

  /**
   * 內容顯示變體。
   * @default 'normal'
   */
  readonly variant = input<DescriptionContentVariant>('normal');

  /** 點擊圖示事件（僅在 `variant="with-icon"` 且傳入 `icon` 時可用）。 */
  readonly clickIcon = output<void>();

  protected readonly resolvedSize = computed(
    (): DescriptionSize => this.size() ?? this.context?.size ?? 'main',
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.contentHost,
      classes.contentVariant(this.variant()),
      classes.contentSize(this.resolvedSize()),
    ),
  );
}
