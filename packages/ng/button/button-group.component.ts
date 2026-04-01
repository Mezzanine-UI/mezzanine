import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  buttonGroupClasses as classes,
  ButtonGroupOrientation,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import clsx from 'clsx';
import { MZN_BUTTON_GROUP, MznButtonGroupContext } from './button-group.token';

/**
 * 將多個 `[mznButton]` 水平或垂直排列為群組。
 *
 * 透過 DI 向子按鈕提供預設的 `variant`、`size`、`disabled`，
 * 子按鈕若自行指定則優先使用自身值。
 *
 * @example
 * ```html
 * import { MznButtonGroup, MznButton } from '@mezzanine-ui/ng/button';
 *
 * <mzn-button-group variant="base-secondary" size="sub">
 *   <button mznButton>按鈕 1</button>
 *   <button mznButton>按鈕 2</button>
 *   <button mznButton>按鈕 3</button>
 * </mzn-button-group>
 * ```
 */
@Component({
  selector: 'mzn-button-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MZN_BUTTON_GROUP,
      useFactory: (group: MznButtonGroup): MznButtonGroupContext => ({
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
      deps: [MznButtonGroup],
    },
  ],
  host: {
    role: 'group',
    '[class]': 'hostClasses()',
    '[attr.aria-orientation]': 'orientation()',
  },
  template: '<ng-content />',
})
export class MznButtonGroup {
  /**
   * 子按鈕的預設變體。
   * @default 'base-primary'
   */
  readonly variant = input<ButtonVariant>('base-primary');

  /**
   * 子按鈕的預設尺寸。
   * @default 'main'
   */
  readonly size = input<ButtonSize>('main');

  /**
   * 子按鈕的預設 disabled 狀態。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否撐滿容器寬度。
   * @default false
   */
  readonly fullWidth = input(false);

  /**
   * 群組排列方向。
   * @default 'horizontal'
   */
  readonly orientation = input<ButtonGroupOrientation>('horizontal');

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.orientation(this.orientation()), {
      [classes.fullWidth]: this.fullWidth(),
    }),
  );
}
