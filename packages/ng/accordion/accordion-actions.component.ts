import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { accordionClasses } from '@mezzanine-ui/core/accordion';
import {
  buttonGroupClasses,
  ButtonGroupOrientation,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import clsx from 'clsx';
import {
  MZN_BUTTON_GROUP,
  MznButtonGroupContext,
} from '@mezzanine-ui/ng/button';

/**
 * 手風琴操作列元件，用於在 `MznAccordionTitle` 中放置操作按鈕。
 *
 * 鏡像 React `<AccordionActions>`，內部即為 `<ButtonGroup>` —
 * 對外提供與 `MznButtonGroup` 相同的 props，並在 host 額外帶上
 * `mzn-accordion__title__actions` 類別。
 *
 * @example
 * ```html
 * import { MznAccordionActions } from '@mezzanine-ui/ng/accordion';
 * import { MznButton } from '@mezzanine-ui/ng/button';
 *
 * <div mznAccordion>
 *   <div mznAccordionTitle>
 *     標題
 *     <div actions mznAccordionActions>
 *       <button mznButton variant="outlined">編輯</button>
 *     </div>
 *   </div>
 *   <div mznAccordionContent>內容</div>
 * </div>
 * ```
 *
 * @see MznAccordionTitle
 */
@Component({
  selector: '[mznAccordionActions]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MZN_BUTTON_GROUP,
      useFactory: (group: MznAccordionActions): MznButtonGroupContext => ({
        get disabled(): boolean {
          return group.disabled();
        },
        get size(): ButtonSize {
          return group.size();
        },
        get variant(): ButtonVariant {
          return group.variant();
        },
      }),
      deps: [MznAccordionActions],
    },
  ],
  host: {
    role: 'group',
    '[class]': 'hostClasses()',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.variant]': 'null',
    '[attr.size]': 'null',
    '[attr.disabled]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.orientation]': 'null',
  },
  template: `<ng-content />`,
})
export class MznAccordionActions {
  /** 子按鈕的預設變體。 */
  readonly variant = input<ButtonVariant>('base-primary');

  /** 子按鈕的預設尺寸。 */
  readonly size = input<ButtonSize>('main');

  /** 子按鈕的預設 disabled 狀態。 */
  readonly disabled = input(false);

  /** 是否撐滿容器寬度。 */
  readonly fullWidth = input(false);

  /** 群組排列方向。 */
  readonly orientation = input<ButtonGroupOrientation>('horizontal');

  protected readonly hostClasses = computed((): string =>
    clsx(
      accordionClasses.titleActions,
      buttonGroupClasses.host,
      buttonGroupClasses.orientation(this.orientation()),
      {
        [buttonGroupClasses.fullWidth]: this.fullWidth(),
      },
    ),
  );
}
