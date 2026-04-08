import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
import clsx from 'clsx';
import { MznTabItem } from './tab-item.component';
import { MZN_TABS_CONTEXT } from './tab-context';

/**
 * Tab 容器元件。
 *
 * 管理子 `MznTabItem` 的 active 狀態，並計算 active bar 的位置。
 * 支援受控模式（`activeKey` input + `activeKeyChange` output）與
 * 非受控模式（`defaultActiveKey` 搭配內部狀態）。
 *
 * @example
 * ```html
 * import { MznTabs, MznTabItem } from '@mezzanine-ui/ng/tab';
 *
 * // 受控模式
 * <mzn-tabs [(activeKey)]="currentTab" direction="horizontal">
 *   <mzn-tab-item [key]="0">首頁</mzn-tab-item>
 *   <mzn-tab-item [key]="1">設定</mzn-tab-item>
 * </mzn-tabs>
 *
 * // 非受控模式
 * <mzn-tabs [defaultActiveKey]="0">
 *   <mzn-tab-item [key]="0">首頁</mzn-tab-item>
 *   <mzn-tab-item [key]="1">設定</mzn-tab-item>
 * </mzn-tabs>
 * ```
 */
@Component({
  selector: 'mzn-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MZN_TABS_CONTEXT,
      useExisting: forwardRef(() => MznTabs),
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[style.--active-bar-length]': 'activeBarLengthVar()',
    '[style.--active-bar-shift]': 'activeBarShiftVar()',
  },
  template: `
    <ng-content />
    <div [class]="activeBarClass"></div>
  `,
})
export class MznTabs implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);

  /** 子 TabItem 們。 */
  readonly tabItems = contentChildren(MznTabItem);

  /**
   * 目前選取的 key（受控模式）。
   * 若不提供，元件會使用 `defaultActiveKey` 作為初始值並自行管理。
   */
  readonly activeKey = input<string | number | undefined>(undefined);

  /**
   * 非受控模式下的初始 active key。
   * 僅在 `activeKey` 未設定時生效。
   * @default 0
   */
  readonly defaultActiveKey = input<string | number>(0);

  /** 方向。 */
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');

  /** 尺寸。 */
  readonly size = input<'main' | 'sub'>('main');

  /** Tab 切換事件。 */
  readonly activeKeyChange = output<string | number>();

  /** 內部管理的 active key（非受控模式）。 */
  private readonly internalActiveKey = signal<string | number | undefined>(
    undefined,
  );

  /**
   * 實際生效的 active key。
   * 受控模式取 `activeKey` input，非受控模式取內部狀態。
   */
  readonly resolvedActiveKey = computed((): string | number => {
    const controlled = this.activeKey();

    if (controlled !== undefined) {
      return controlled;
    }

    const internal = this.internalActiveKey();

    if (internal !== undefined) {
      return internal;
    }

    return this.defaultActiveKey();
  });

  private readonly activeBarLength = signal(0);
  private readonly activeBarShift = signal(0);

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      this.direction() === 'vertical'
        ? classes.tabVertical
        : classes.tabHorizontal,
      this.size() === 'sub' ? classes.tabSizeSub : classes.tabSizeMain,
    ),
  );

  protected readonly activeBarClass = classes.tabActiveBar;

  protected readonly activeBarLengthVar = computed(
    (): string => `${this.activeBarLength()}px`,
  );

  protected readonly activeBarShiftVar = computed(
    (): string => `${this.activeBarShift()}px`,
  );

  private viewInitialized = false;

  constructor() {
    // React-equivalent of useLayoutEffect([activeKey, direction])
    // Reactively update active bar when activeKey or direction changes
    effect(() => {
      // Read signals to track them as dependencies
      this.resolvedActiveKey();
      this.direction();
      this.tabItems();

      // Only update after view init (need DOM elements)
      if (this.viewInitialized) {
        // Use requestAnimationFrame to ensure DOM has been updated
        requestAnimationFrame(() => {
          this.updateActiveBar();
          this.cdr.markForCheck();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.updateActiveBar();
  }

  /**
   * 由子 `MznTabItem` 呼叫，處理 tab 點擊切換。
   */
  handleTabClick(key: string | number, _index: number): void {
    const current = this.resolvedActiveKey();

    if (current === key) {
      return;
    }

    // 非受控模式：更新內部狀態
    if (this.activeKey() === undefined) {
      this.internalActiveKey.set(key);
    }

    this.activeKeyChange.emit(key);
  }

  private updateActiveBar(): void {
    const items = this.tabItems();
    const resolvedKey = this.resolvedActiveKey();
    const activeItem = items.find((item) => item.key() === resolvedKey);

    if (!activeItem) {
      return;
    }

    const buttonEl = activeItem.getButtonElement();

    if (!buttonEl) {
      return;
    }

    const isHorizontal = this.direction() !== 'vertical';

    if (isHorizontal) {
      this.activeBarLength.set(buttonEl.offsetWidth);
      this.activeBarShift.set(buttonEl.offsetLeft);
    } else {
      this.activeBarLength.set(buttonEl.offsetHeight);
      this.activeBarShift.set(buttonEl.offsetTop);
    }
  }
}
