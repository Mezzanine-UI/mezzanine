import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  descriptionClasses as classes,
  DescriptionSize,
  DescriptionWidthType,
} from '@mezzanine-ui/core/description';
import { BadgeDotVariant } from '@mezzanine-ui/core/badge';
import { IconDefinition } from '@mezzanine-ui/icons';
import { type Placement } from '@floating-ui/dom';
import clsx from 'clsx';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTooltip } from '@mezzanine-ui/ng/tooltip';
import { MZN_DESCRIPTION_CONTEXT } from './description-context';

/**
 * Description 標題元件。
 *
 * 支援 badge、icon（含 tooltip）等修飾。
 * 文字可透過 `<ng-content />` 傳入，或透過 `text` input 傳入（供程式化使用）。
 *
 * @example
 * ```html
 * <div mznDescriptionTitle widthType="narrow">欄位名稱</div>
 * <div mznDescriptionTitle badge="dot-success" text="訂單狀態" ></div>
 * ```
 */
@Component({
  selector: '[mznDescriptionTitle]',
  standalone: true,
  imports: [MznBadge, MznIcon, MznTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.badge]': 'null',
    '[attr.icon]': 'null',
    '[attr.size]': 'null',
    '[attr.text]': 'null',
    '[attr.tooltip]': 'null',
    '[attr.tooltipPlacement]': 'null',
    '[attr.widthType]': 'null',
  },
  template: `
    @if (badge()) {
      <span
        mznBadge
        [class]="textClass"
        [variant]="badge()!"
        [size]="resolvedSize()"
        [text]="text() ?? ''"
      ></span>
    } @else if (text()) {
      <span [class]="textClass">{{ text() }}</span>
    } @else {
      <span [class]="textClass"><ng-content /></span>
    }
    @if (icon()) {
      @if (tooltip()) {
        <i
          mznIcon
          [icon]="icon()!"
          [size]="16"
          [mznTooltip]="tooltip()"
          [tooltipPlacement]="tooltipPlacement() ?? 'top'"
        ></i>
      } @else {
        <i mznIcon [icon]="icon()!" [size]="16"></i>
      }
    }
  `,
})
export class MznDescriptionTitle {
  private readonly context = inject(MZN_DESCRIPTION_CONTEXT, {
    optional: true,
  });

  /**
   * 顯示於標題左側的徽章圓點（BadgeDotVariant）。
   */
  readonly badge = input<BadgeDotVariant | undefined>(undefined);

  /**
   * 顯示於標題右側的提示圖示。
   */
  readonly icon = input<IconDefinition | undefined>(undefined);

  /**
   * 尺寸（優先使用父層 Description 提供的值）。
   */
  readonly size = input<DescriptionSize>();

  /**
   * 標題文字（程式化傳入；使用 `<ng-content />` 時可省略）。
   */
  readonly text = input<string | undefined>(undefined);

  /**
   * 圖示 tooltip 文字。
   */
  readonly tooltip = input<string | undefined>(undefined);

  /**
   * Tooltip 定位方向。
   * @default 'top'
   */
  readonly tooltipPlacement = input<Placement | undefined>(undefined);

  /**
   * 標題寬度類型。
   * @default 'stretch'
   */
  readonly widthType = input<DescriptionWidthType>('stretch');

  protected readonly resolvedSize = computed(
    (): DescriptionSize => this.size() ?? this.context?.size ?? 'main',
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.titleHost,
      classes.titleSize(this.resolvedSize()),
      classes.titleWidth(this.widthType()),
    ),
  );

  protected readonly textClass = classes.titleText;
}
