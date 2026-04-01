import {
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  buttonClasses as classes,
  ButtonIconType,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import clsx from 'clsx';
import { MZN_BUTTON_GROUP } from './button-group.token';

/**
 * 通用按鈕 directive，支援多種外觀變體與尺寸。
 *
 * 使用 attribute selector `[mznButton]`，可套用於 `<button>`、`<a>` 或任意 host element，
 * 實現與 React 版 `component` prop 等效的多型態功能。
 *
 * 透過 `variant` 控制外觀、`size` 控制尺寸、`iconType` 決定圖示排列方式。
 * 若放在 `<mzn-button-group>` 內部，會自動繼承 group 的 variant / size / disabled（除非自行指定）。
 *
 * @example
 * ```html
 * import { MznButton } from '@mezzanine-ui/ng/button';
 *
 * <!-- 基本用法 -->
 * <button mznButton variant="base-primary">送出</button>
 *
 * <!-- 以 <a> 渲染 -->
 * <a mznButton variant="base-secondary" href="/dashboard">前往儀表板</a>
 *
 * <!-- disabled + loading -->
 * <button mznButton [disabled]="true" [loading]="true">處理中</button>
 * ```
 */
@Directive({
  selector: '[mznButton]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'resolvedDisabled()',
    '[attr.disabled]': 'resolvedDisabled() || null',
  },
})
export class MznButton {
  private readonly group = inject(MZN_BUTTON_GROUP, { optional: true });
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const handler = (event: Event): void => {
      if (this.resolvedDisabled() || this.loading()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    this.elRef.nativeElement.addEventListener('click', handler, true);
    this.destroyRef.onDestroy(() => {
      this.elRef.nativeElement.removeEventListener('click', handler, true);
    });
  }

  /**
   * 按鈕的視覺樣式變體。
   * @default 'base-primary'
   */
  readonly variant = input<ButtonVariant>();

  /**
   * 按鈕尺寸。
   * @default 'main'
   */
  readonly size = input<ButtonSize>();

  /**
   * 是否禁用按鈕。
   * @default false
   */
  readonly disabled = input<boolean>();

  /**
   * 是否顯示載入狀態。
   * @default false
   */
  readonly loading = input(false);

  /**
   * 圖示定義（來自 `@mezzanine-ui/icons`）。
   */
  readonly icon = input<IconDefinition>();

  /**
   * 圖示排列方式。
   * - `'leading'` — 圖示在文字左側
   * - `'trailing'` — 圖示在文字右側
   * - `'icon-only'` — 僅顯示圖示
   */
  readonly iconType = input<ButtonIconType>();

  /** 解析後的 variant（優先使用自身，否則沿用 group）。 */
  protected readonly resolvedVariant = computed(
    (): ButtonVariant =>
      this.variant() ?? this.group?.variant ?? 'base-primary',
  );

  /** 解析後的 size（優先使用自身，否則沿用 group）。 */
  protected readonly resolvedSize = computed(
    (): ButtonSize => this.size() ?? this.group?.size ?? 'main',
  );

  /** 解析後的 disabled（優先使用自身，否則沿用 group）。 */
  readonly resolvedDisabled = computed(
    (): boolean => this.disabled() ?? this.group?.disabled ?? false,
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.variant(this.resolvedVariant()),
      classes.size(this.resolvedSize()),
      {
        [classes.disabled]: this.resolvedDisabled(),
        [classes.loading]: this.loading(),
        [classes.iconLeading]: this.iconType() === 'leading',
        [classes.iconTrailing]: this.iconType() === 'trailing',
        [classes.iconOnly]: this.iconType() === 'icon-only',
      },
    ),
  );
}
