import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  descriptionClasses as classes,
  DescriptionOrientation,
  DescriptionSize,
  DescriptionWidthType,
} from '@mezzanine-ui/core/description';
import { BadgeDotVariant } from '@mezzanine-ui/core/badge';
import { IconDefinition } from '@mezzanine-ui/icons';
import { type Placement } from '@floating-ui/dom';
import clsx from 'clsx';
import {
  MZN_DESCRIPTION_CONTEXT,
  DescriptionContextValue,
} from './description-context';
import { MznDescriptionTitle } from './description-title.component';

/**
 * 描述區塊容器元件，包含標題與內容。
 *
 * 透過 `MZN_DESCRIPTION_CONTEXT` 向子元件注入 `size`。
 * `title` 為必填，會在內部自動渲染 `MznDescriptionTitle`。
 * 其餘 `badge`、`icon`、`tooltip`、`tooltipPlacement`、`widthType` 皆為標題相關屬性。
 *
 * @example
 * ```html
 * import { MznDescription, MznDescriptionContent } from '@mezzanine-ui/ng/description';
 *
 * <div mznDescription title="訂購日期" widthType="narrow">
 *   <span mznDescriptionContent>2025-11-03</span>
 * </div>
 * ```
 */
@Component({
  selector: '[mznDescription]',
  standalone: true,
  imports: [MznDescriptionTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MZN_DESCRIPTION_CONTEXT,
      useFactory: (self: MznDescription): DescriptionContextValue => ({
        get size(): DescriptionSize {
          return self.size();
        },
      }),
      deps: [MznDescription],
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.badge]': 'null',
    '[attr.icon]': 'null',
    '[attr.orientation]': 'null',
    '[attr.size]': 'null',
    '[attr.title]': 'null',
    '[attr.tooltip]': 'null',
    '[attr.tooltipPlacement]': 'null',
    '[attr.widthType]': 'null',
  },
  template: `
    <div
      mznDescriptionTitle
      [badge]="badge()"
      [icon]="icon()"
      [size]="size()"
      [text]="title()"
      [tooltip]="tooltip()"
      [tooltipPlacement]="tooltipPlacement()"
      [widthType]="widthType()"
    ></div>
    <ng-content />
  `,
})
export class MznDescription {
  /**
   * 標題右側的徽章圓點。
   */
  readonly badge = input<BadgeDotVariant | undefined>(undefined);

  /**
   * 標題右側的提示圖示。
   */
  readonly icon = input<IconDefinition | undefined>(undefined);

  /**
   * 排列方向。
   * @default 'horizontal'
   */
  readonly orientation = input<DescriptionOrientation>('horizontal');

  /**
   * 尺寸。
   * @default 'main'
   */
  readonly size = input<DescriptionSize>('main');

  /**
   * 標題文字。
   */
  readonly title = input.required<string>();

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

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.orientation(this.orientation())),
  );
}
